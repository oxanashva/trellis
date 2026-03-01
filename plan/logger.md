# Logging Strategy: Grafana Cloud + Loki

**Date**: 2026-02-26

---

## Problem

The application runs on Render (stateless containers, ephemeral filesystem). The existing
`winston-elasticsearch` transport points to `http://elasticsearch:9200`, which is only reachable
inside the local `docker-compose` network. On Render, no Elasticsearch is reachable — logs only
go to stdout (visible in Render's 7-day log dashboard but not searchable or structured in Kibana).

---

## Solution: Variant B — Grafana Cloud + Loki

Replace the cloud log destination with **Grafana Cloud's free managed Loki service**.
Structured, correlated logs from Render are queryable and visualizable at all times —
no local dependency, zero cost.

The local `docker-compose` ELK stack is preserved for local development.
Both transports coexist via env var guards:
- `ELASTICSEARCH_URL` set → ES transport activates (local `docker-compose` only)
- `LOKI_URL` set → Loki transport activates (Render / production)

---

## Architecture

```
[Render App — Node.js]
  winston Console transport     (always on)
  winston-loki transport        (when LOKI_URL is set → production)
  winston-elasticsearch         (when ELASTICSEARCH_URL is set → local dev)
         |
         ↓ HTTPS (batched every 5s, retried on failure)
[Grafana Cloud — Loki push endpoint]
         |
         ↓
[Grafana Dashboard]   ← replaces Kibana for production logs

[Local docker-compose]
  App → elasticsearch:9200 → Kibana:5601   (unchanged)
```

**Enterprise pattern**: Managed log aggregation with label-based indexing. Loki indexes only
labels (app, service, level, env), not full message bodies — cheaper to operate at scale than
Elasticsearch while preserving full-text search via LogQL.

---

## Files Changed

| File | Change |
|------|--------|
| `trellis-backend/services/logger.service.js` | Added `winston-loki` import + conditional Loki transport block |
| `trellis-backend/package.json` | Added `winston-loki` dependency |

**Not changed**: `Dockerfile`, `Jenkinsfile.groovy`, `docker-compose.yml`

---

## Setup Steps

### 1. Grafana Cloud Account (one-time, manual)

1. Create a free account at https://grafana.com
2. Create a new Stack (free tier)
3. Go to **Connections → Data Sources → Loki**
4. Note the **Loki URL**: `https://logs-prod-XXX.grafana.net`
5. Go to **My Account → Access Policies** → create a token with `logs:write` scope
6. Note your **numeric user ID** and the **API token**

### 2. Render Environment Variables

Add to the Render service dashboard → Environment:

| Key | Value |
|-----|-------|
| `LOKI_URL` | `https://logs-prod-XXX.grafana.net` |
| `LOKI_USER` | Your numeric Grafana Cloud user ID |
| `LOKI_PASSWORD` | Your Grafana Cloud API token |

### 3. Local Development

Do **not** set `LOKI_URL` in `trellis-backend/.env`.
Local dev continues to use `ELASTICSEARCH_URL=http://elasticsearch:9200` via `docker-compose`.

---

## Grafana Queries (LogQL)

```logql
# All app logs
{app="trellis"}

# Backend errors only
{app="trellis", service="backend"} | json | level="error"

# Frontend logs
{app="trellis", service="frontend"}

# Trace a full request by correlationId
{app="trellis"} | json | requestId="<uuid>"

# All logs for a user
{app="trellis"} | json | userId="<mongo-id>"
```

---

## Key Design Decisions

**Backpressure**: `winston-loki` batches in memory (5s interval) and retries on failure.
If Loki is unreachable, the app continues responding — logs fall back to console.
For zero-loss guarantees (future upgrade): add a Redis Streams buffer between app and Loki.

**Sensitive data**: `sanitizeMeta()` runs before any log is emitted to Winston, so all
transports (Console, ES, Loki) receive already-redacted payloads. Labels never contain
message body content.

**Dual transport**: Both ES and Loki transports are independently guarded by env vars,
so they can run simultaneously (useful if testing Loki locally via `.env.devlocal`).
