// const socketService = require('../../services/socket.service')
const boardService = require('./board.service')
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')
const userService = require('../user/user.service')


async function getBoards(req, res) {
      try {
            const boards = await boardService.query(req.query)
            res.send(boards)
      } catch (err) {
            logger.error('Cannot get boards', err)
            res.status(500).send({ err: 'Failed to get boards' })
      }
}

async function getBoardById(req, res) {
      try {
            // console.log('controller got req params,', req.params)
            const { id } = req.params
            // const { boardId } = req.params
            // console.log('controller got board id,', id)
            board = await boardService.getById(id)
            // console.log('controller got board,', board)
            res.json(board)
      } catch (error) {
            logger.error('Cannot get board', err)
            res.status(500).send({ err: 'Failed to get board' })
      }
}

async function addBoard(req, res) {
      try {
            var board = req.body
            // board.byUserId = req.session.user._id
            board = await boardService.add(board)

            // // prepare the updated board for sending out
            // board.byUser = await userService.getById(board.byUserId)
            // board.aboutUser = await userService.getById(board.aboutUserId)

            // console.log('CTRL SessionId:', req.sessionID);
            // socketService.broadcast({ type: 'board-added', data: board })
            // socketService.emitToAll({ type: 'user-updated', data: board.byUser, room: req.session.user._id })
            res.send(board)

      } catch (err) {
            console.log(err)
            logger.error('Failed to add board', err)
            res.status(500).send({ err: 'Failed to add board' })
      }
}

async function updateBoard(req, res) {
      try {
            const board = req.body
            const updatedBoard = await boardService.update(board)
            console.log('updatedBoard')
            socketService.broadcast({ type: 'board-update', data: updatedBoard, room: updatedBoard._id })
            res.json(updatedBoard)
      } catch (err) {
            logger.error('Cannot update board', err)
            res.status(500).send({ err: 'Failed to update board' })
      }
}

async function deleteBoard(req, res) {
      try {
            await boardService.remove(req.params.id)
            res.send({ msg: 'Deleted successfully' })
      } catch (err) {
            logger.error('Failed to delete board', err)
            res.status(500).send({ err: 'Failed to delete board' })
      }
}


module.exports = {
      getBoards,
      getBoardById,
      addBoard,
      updateBoard,
      deleteBoard
}