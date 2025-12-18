import { logger } from '../../services/logger.service.js'
import { boardService } from './board.service.js'

export async function getBoards(req, res) {
    try {
        const filterBy = {
            name: req.query.name || '',
        }
        const boards = await boardService.query(filterBy)
        res.json(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(400).send({ err: 'Failed to get boards' })
    }
}

export async function getBoardById(req, res) {
    try {
        const boardId = req.params.id
        const board = await boardService.getById(boardId)
        res.json(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(400).send({ err: 'Failed to get board' })
    }
}

// ------------------- Board CRUD -------------------

export async function addBoard(req, res) {
    // const { loggedinUser, body: board } = req
    const board = req.body

    try {
        // board.owner = loggedinUser
        const addedBoard = await boardService.add(board)
        res.json(addedBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(400).send({ err: 'Failed to add board' })
    }
}

export async function updateBoard(req, res) {
    // const { loggedinUser, body: board } = req
    // const { _id: userId, isAdmin } = loggedinUser
    const board = req.body

    // if (!isAdmin && board.owner._id !== userId) {
    //     res.status(403).send('Not your board...')
    //     return
    // }

    try {
        const updatedBoard = await boardService.update(board)
        res.json(updatedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(400).send({ err: 'Failed to update board' })
    }
}

export async function removeBoard(req, res) {
    try {
        const boardId = req.params.id
        const removedId = await boardService.remove(boardId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board', err)
        res.status(400).send({ err: 'Failed to remove board' })
    }
}

// ------------------- Groups CRUD -------------------

export async function addBoardGroup(req, res) {
    try {
        const boardId = req.params.id
        const group = req.body
        const savedGroup = await boardService.addGroup(boardId, group)
        res.send(savedGroup)
    } catch (err) {
        logger.error('Failed to add group', err)
        res.status(400).send({ err: 'Failed to add group' })
    }
}

export async function updateBoardGroup(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const group = req.body
        const savedGroup = await boardService.updateGroup(boardId, groupId, group)
        res.send(savedGroup)
    } catch (err) {
        logger.error('Failed to update group', err)
        res.status(400).send({ err: 'Failed to update group' })
    }
}

export async function removeBoardGroup(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const removedId = await boardService.removeGroup(boardId, groupId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove group', err)
        res.status(400).send({ err: 'Failed to remove group' })
    }
}

// ------------------- Tasks CRUD -------------------

export async function addBoardTask(req, res) {
    try {
        const boardId = req.params.id
        const task = req.body
        const savedTask = await boardService.addTask(boardId, task)
        res.send(savedTask)
    } catch (err) {
        logger.error('Failed to add task', err)
        res.status(400).send({ err: 'Failed to add task' })
    }
}

export async function updateBoardTask(req, res) {
    try {
        const { id: boardId, taskId } = req.params
        const task = req.body
        const savedTask = await boardService.updateTask(boardId, taskId, task)
        res.send(savedTask)
    } catch (err) {
        logger.error('Failed to update task', err)
        res.status(400).send({ err: 'Failed to update task' })
    }
}

export async function removeBoardTask(req, res) {
    try {
        const { id: boardId, taskId } = req.params
        const removedId = await boardService.removeTask(boardId, taskId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove task', err)
        res.status(400).send({ err: 'Failed to remove task' })
    }
}

// ------------------- Actions CRUD -------------------

export async function addBoardAction(req, res) {
    try {
        const boardId = req.params.id
        const action = req.body
        const savedAction = await boardService.addBoardAction(boardId, action)
        res.send(savedAction)
    } catch (err) {
        logger.error('Failed to add board action', err)
        res.status(400).send({ err: 'Failed to add board action' })
    }
}

export async function updateBoardAction(req, res) {
    try {
        const { id: boardId, actionId } = req.params
        const action = req.body
        const savedAction = await boardService.updateBoardAction(boardId, actionId, action)
        res.send(savedAction)
    } catch (err) {
        logger.error('Failed to update board action', err)
        res.status(400).send({ err: 'Failed to update board action' })
    }
}

export async function removeBoardAction(req, res) {
    try {
        const { id: boardId, actionId } = req.params
        const removedId = await boardService.removeBoardAction(boardId, actionId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board action', err)
        res.status(400).send({ err: 'Failed to remove board action' })
    }
}

// ------------------- Labels CRUD -------------------

export async function addBoardLabel(req, res) {
    try {
        const boardId = req.params.id
        const label = req.body
        const savedLabel = await boardService.addBoardLabel(boardId, label)
        res.send(savedLabel)
    } catch (err) {
        logger.error('Failed to add board label', err)
        res.status(400).send({ err: 'Failed to add board label' })
    }
}

export async function updateBoardLabel(req, res) {
    try {
        const { id: boardId, labelId } = req.params
        const label = req.body
        const savedLabel = await boardService.updateBoardLabel(boardId, labelId, label)
        res.send(savedLabel)
    } catch (err) {
        logger.error('Failed to update board label', err)
        res.status(400).send({ err: 'Failed to update board label' })
    }
}

export async function removeBoardLabel(req, res) {
    try {
        const { id: boardId, labelId } = req.params
        const removedId = await boardService.removeBoardLabel(boardId, labelId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board label', err)
        res.status(400).send({ err: 'Failed to remove board label' })
    }
}

// ------------------- Members CRUD -------------------

export async function addBoardMember(req, res) {
    try {
        const boardId = req.params.id
        const member = req.body
        const savedMember = await boardService.addBoardMember(boardId, member)
        res.send(savedMember)
    } catch (err) {
        logger.error('Failed to add board member', err)
        res.status(400).send({ err: 'Failed to add board member' })
    }
}

export async function updateBoardMember(req, res) {
    try {
        const { id: boardId, memberId } = req.params
        const member = req.body
        const savedMember = await boardService.updateBoardMember(boardId, memberId, member)
        res.send(savedMember)
    } catch (err) {
        logger.error('Failed to update board member', err)
        res.status(400).send({ err: 'Failed to update board member' })
    }
}

export async function removeBoardMember(req, res) {
    try {
        const { id: boardId, memberId } = req.params
        const removedId = await boardService.removeBoardMember(boardId, memberId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board member', err)
        res.status(400).send({ err: 'Failed to remove board member' })
    }
}

// ------------------- Messages CRUD -------------------

export async function addBoardMsg(req, res) {
    const { loggedinUser } = req

    try {
        const boardId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await boardService.addBoardMsg(boardId, msg)
        res.send(savedMsg)
    } catch (err) {
        logger.error('Failed to add board msg', err)
        res.status(400).send({ err: 'Failed to add board msg' })
    }
}

export async function updateBoardMsg(req, res) {
    try {
        const { id: boardId, msgId } = req.params
        const msg = req.body
        const savedMsg = await boardService.updateBoardMsg(boardId, msgId, msg)
        res.send(savedMsg)
    } catch (err) {
        logger.error('Failed to update board msg', err)
        res.status(400).send({ err: 'Failed to update board msg' })
    }
}

export async function removeBoardMsg(req, res) {
    try {
        const { id: boardId, msgId } = req.params

        const removedId = await boardService.removeBoardMsg(boardId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board msg', err)
        res.status(400).send({ err: 'Failed to remove board msg' })
    }
}
