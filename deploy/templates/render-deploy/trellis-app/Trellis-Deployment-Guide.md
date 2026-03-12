# Trellis Deployment Guide

#### For Customer Use

This document explains how to deploy and update the Trellis application using the files provided to you. The application consists of two parts:

- **Backend** — deployed from a prebuilt Docker image
- **Frontend** — deployed from your repo

---

### 1. Contents of the Package

The ZIP file you received contains:

```text
trellis-app/
├─ trellis-backend/
│   └─ render.yaml/
├─ trellis-frontend/
│	└─ render.yaml
├─ Trellis-Deployment-Guide.md
└─ Trellis-Deployment-Guide.pdf

```

The backend is provided as a Docker image hosted in GHCR:

```text
ghcr.io/oxanashva/trellis-backend:latest
```

---

### 3. Deploying the Application on Render

#### Step 1 - Prepare a Git Repository

You can use GitHub, GitLab, or Bitbucket.
The repository should contain exactly the files from the package.
Commit and push these files to your repository.

### Step 2 - Add Container Registry Credentials

1. Log in to your Render account: [https://dashboard.render.com](https://dashboard.render.com)
2. Go to **Settings** in **My Workspace**
3. Click **Add Credentials** in **Container Registry Credentials**
4. Fill out the fields:

| Field                 | Value               |
| :-------------------- | :------------------ |
| Name                  | GHCR                |
| Registry              | GitHub              |
| Username              | oxanashva           |
| Personal Access Token | Provided GHCR Token |

#### Step 3 — Create a Backend Blueprint from your Repository

1. Log in to your Render account: [https://dashboard.render.com](https://dashboard.render.com)
2. Go to **Blueprints**
3. Click **New Blueprint Instance**
4. Fill out the fields:

| Field          | Value                       |
| :------------- | :-------------------------- |
| Blueprint Name | Trellis-Backend             |
| Branch         | main                        |
| Blueprint Path | trellis-backend/render.yaml |

5. Setting Environment Variables:
   Render will show a notification that some environment variables are missing.
   You must fill these in before deploying.

#### Backend Variables

| Variable  | Description                                      |
| :-------- | :----------------------------------------------- |
| MONGO_URL | Your MongoDB connection string                   |
| DB_NAME   | Name of the database                             |
| SECRET    | Any random secret string used for authentication |
| NODE_ENV  | Already set to `production`                      |

6. Click **Deploy Blueprint**
7. In the meantime, the deployment will fail because the FRONTEND_URL environment variable is not set. This is expected and will be resolved once the frontend is deployed.

---

#### Prepare frontend build

1. Go to **My Workspace → trellis-backend service** and copy its URL
2. Send the **trellis-backend service URL** and **Cloudinary Cloud Name** (e.g. `da9dfrthc`) to our support to prepare the frontend build for you
3. Extract files from provided **build** zip folder
4. Navigate to the **trellis-frontend** folder in your **trellis-app** repository
5. Click **Add Files** button and drag the **build** folder
6. Commit changes
7. The folder structure after upload should be as follows:

```text
trellis-app/
├─ trellis-backend/
│   └─ render.yaml/
├─ trellis-frontend/
│   ├─ build/
│	└─ render.yaml
├─ render.yaml
├─ Trellis-Deployment-Guide.md
└─ Trellis-Deployment-Guide.pdf

```

---

#### Step 4 — Create a Frontend Blueprint from your Repository

1. Log in to your Render account: [https://dashboard.render.com](https://dashboard.render.com)
2. Go to **Blueprints**
3. Click **New Blueprint Instance**
4. Fill out the fields:

| Field          | Value                        |
| :------------- | :--------------------------- |
| Blueprint Name | Trellis-Frontend             |
| Branch         | main                         |
| Blueprint Path | trellis-frontend/render.yaml |

5. Click **Deploy Blueprint**

### 5. Deployment Order

To ensure everything works correctly:

- Deploy **trellis-backend** first
- The deployment will initially fail because the **FRONTEND_URL** environment variable is not set. This is expected and will be resolved once the frontend is deployed.
- Copy the backend URL and send it to our support
- Deploy **trellis-frontend**
- Copy the frontend URL, then go to the **trellis-backend** service page → **Environment** **Environment Variables** → **Edit** → **Add** → **New variable**
- Set **FRONTEND_URL** to the frontend URL
- Click **Save and Deploy**
- Wait until it shows **Live**
- Open the app using the frontend URL
  Your application will now be fully operational.

---

### 6. Updating the Application

You will periodically receive updates in one of two forms:

- A **new backend Docker image**
- A **new frontend build folder**

#### Updating the Backend

When you receive a new backend version, you will be told whether:

- The `latest` tag has been updated, or
- A new tag is available (e.g., `8a27e53`)

To redeploy:

- Open the **trellis-backend** service in Render
- Click **Manual Deploy → Deploy latest reference**
  If a new tag is provided:
- Go to **Settings → Deploy → Image → Edit**
- Replace the image URL with the new tag
- Save changes
- Click **Manual Deploy → Deploy latest reference**
  Render will pull the new image and restart the service.

---

#### Updating the Frontend

When you receive a new frontend version, you will receive a new `build/` folder.
To redeploy:

- Open **trellis-frontend** in Render
- Go to **Settings → Static Site**
- Upload the new `build/` folder
- Save changes
- Click **Manual Deploy → Clear Cache & Deploy**
  The updated frontend will go live immediately.

---

### 7. Troubleshooting

#### Backend not responding

- Ensure all backend environment variables are filled in
- Check that MongoDB credentials are correct
- Redeploy the backend manually

#### Frontend not connecting to backend

- Confirm VITE_API_URL contains the correct backend URL
- Redeploy the frontend after updating the variable

#### Build not updating

- Use Clear Cache & Deploy instead of a normal deploy

---

### 8. Support

If you need assistance with deployment or updates, please contact your Trellis project provider.
