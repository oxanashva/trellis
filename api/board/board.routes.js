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
router.post('/:id/group', addBoardGroup)
router.put('/:id/group/:groupId', updateBoardGroup)
router.delete('/:id/group/:groupId', removeBoardGroup)

// tasks routes
router.post('/:id/task', addBoardTask)
router.put('/:id/task/:taskId', updateBoardTask)
router.delete('/:id/task/:taskId', removeBoardTask)

// actions routes
router.post('/:id/action', addBoardAction)
router.put('/:id/action/:actionId', updateBoardAction)
router.delete('/:id/action/:actionId', removeBoardAction)

// labels routes
router.post('/:id/label', addBoardLabel)
router.put('/:id/label/:labelId', updateBoardLabel)
router.delete('/:id/label/:labelId', removeBoardLabel)

// members routes
router.post('/:id/member', addBoardMember)
router.put('/:id/member/:memberId', updateBoardMember)
router.delete('/:id/member/:memberId', removeBoardMember)

// router.get('/', log, getBoards)
// router.get('/:id', log, getBoardById)
// router.post('/', log, requireAuth, addBoard)
// router.put('/:id', requireAuth, updateBoard)
// router.delete('/:id', requireAuth, removeBoard)
// // router.delete('/:id', requireAuth, requireAdmin, removeBoard)

// // groups routes
// router.post('/:id/group', requireAuth, addBoardGroup)
// router.put('/:id/group/:groupId', requireAuth, updateBoardGroup)
// router.delete('/:id/group/:groupId', requireAuth, removeBoardGroup)

// // tasks routes
// router.post('/:id/task', requireAuth, addBoardTask)
// router.put('/:id/task/:taskId', requireAuth, updateBoardTask)
// router.delete('/:id/task/:taskId', requireAuth, removeBoardTask)

// // actions routes
// router.post('/:id/action', requireAuth, addBoardAction)
// router.put('/:id/action/:actionId', requireAuth, updateBoardAction)
// router.delete('/:id/action/:actionId', requireAuth, removeBoardAction)

// // labels routes
// router.post('/:id/label', requireAuth, addBoardLabel)
// router.put('/:id/label/:labelId', requireAuth, updateBoardLabel)
// router.delete('/:id/label/:labelId', requireAuth, removeBoardLabel)

// // members routes
// router.post('/:id/member', requireAuth, addBoardMember)
// router.put('/:id/member/:memberId', requireAuth, updateBoardMember)
// router.delete('/:id/member/:memberId', requireAuth, removeBoardMember)

export const boardRoutes = router