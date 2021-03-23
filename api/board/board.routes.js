const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {getBoards, getBoardById, addBoard, deleteBoard, updateBoard} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:id', log, getBoardById)
router.post('/',  log, addBoard)
router.delete('/:id',  log, deleteBoard)
router.put('/:id',  log, updateBoard)

module.exports = router