import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import {
    //board
    getBoards,
    getBoardById,
    addBoard,
    updateBoard,
    removeBoard,
    // groups
    addBoardGroup,
    updateBoardGroup,
    removeBoardGroup,
    // tasks
    addBoardTask,
    updateBoardTask,
    removeBoardTask,
    // actions
    addBoardAction,
    updateBoardAction,
    removeBoardAction,
    // labels
    addBoardLabel,
    updateBoardLabel,
    removeBoardLabel,
    // members
    addBoardMember,
    updateBoardMember,
    removeBoardMember,
} from './board.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:id', log, getBoardById)
router.post('/', log, addBoard)
router.put('/:id', updateBoard)
router.delete('/:id', removeBoard)
// router.delete('/:id', requireAdmin, removeBoard)

// groups routes
router.post('/:id/groups', addBoardGroup)
router.put('/:id/groups/:groupId', updateBoardGroup)
router.delete('/:id/groups/:groupId', removeBoardGroup)

// tasks routes
router.post('/:id/tasks', addBoardTask)
router.put('/:id/tasks/:taskId', updateBoardTask)
router.delete('/:id/tasks/:taskId', removeBoardTask)

// actions routes
router.post('/:id/actions', addBoardAction)
router.put('/:id/actions/', updateBoardAction)
router.delete('/:id/actions/:actionId', removeBoardAction)

// labels routes
router.post('/:id/labels', addBoardLabel)
router.put('/:id/labels/:labelId', updateBoardLabel)
router.delete('/:id/labels/:labelId', removeBoardLabel)

// members routes
router.post('/:id/members', addBoardMember)
router.put('/:id/members/:memberId', updateBoardMember)
router.delete('/:id/members/:memberId', removeBoardMember)

// router.get('/', log, getBoards)
// router.get('/:id', log, getBoardById)
// router.post('/', log, requireAuth, addBoard)
// router.put('/:id', requireAuth, updateBoard)
// router.delete('/:id', requireAuth, removeBoard)
// // router.delete('/:id', requireAuth, requireAdmin, removeBoard)

// // groups routes
// router.post('/:id/groups', requireAuth, addBoardGroup)
// router.put('/:id/groups/:groupId', requireAuth, updateBoardGroup)
// router.delete('/:id/groups/:groupId', requireAuth, removeBoardGroup)

// // tasks routes
// router.post('/:id/tasks', requireAuth, addBoardTask)
// router.put('/:id/tasks/:taskId', requireAuth, updateBoardTask)
// router.delete('/:id/tasks/:taskId', requireAuth, removeBoardTask)

// // actions routes
// router.post('/:id/actions', requireAuth, addBoardAction)
// router.put('/:id/actions/:actionId', requireAuth, updateBoardAction)
// router.delete('/:id/actions/:actionId', requireAuth, removeBoardAction)

// // labels routes
// router.post('/:id/labels', requireAuth, addBoardLabel)
// router.put('/:id/labels/:labelId', requireAuth, updateBoardLabel)
// router.delete('/:id/labels/:labelId', requireAuth, removeBoardLabel)

// // members routes
// router.post('/:id/members', requireAuth, addBoardMember)
// router.put('/:id/members/:memberId', requireAuth, updateBoardMember)
// router.delete('/:id/members/:memberId', requireAuth, removeBoardMember)

export const boardRoutes = router