const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
      try {
            // const criteria = _buildCriteria(filterBy)
            const collection = await dbService.getCollection('board')
            const boards = await collection.find().toArray()
            //   var boards = await collection.aggregate([
            //       {
            //           $match: filterBy
            //       },
            //       {
            //           $lookup:
            //           {
            //               localField: 'byUserId',
            //               from: 'user',
            //               foreignField: '_id',
            //               as: 'byUser'
            //           }
            //       },
            //       {
            //           $unwind: '$byUser'
            //       },
            //       {
            //           $lookup:
            //           {
            //               localField: 'aboutUserId',
            //               from: 'user',
            //               foreignField: '_id',
            //               as: 'aboutUser'
            //           }
            //       },
            //       {
            //           $unwind: '$aboutUser'
            //       }
            //   ]).toArray()
            //   boards = boards.map(board => {
            //       board.byUser = { _id: board.byUser._id, fullname: board.byUser.fullname }
            //       board.aboutUser = { _id: board.aboutUser._id, fullname: board.aboutUser.fullname }
            //       delete board.byUserId
            //       delete board.aboutUserId
            //       return board
            //   })

            return boards
      } catch (err) {
            logger.error('cannot find boards', err)
            throw err
      }

}

async function getById(boardId) {
      try {
            const collection = await dbService.getCollection('board')
            const board = await collection.findOne({ '_id': ObjectId(boardId) })
            // console.log('**** About toy ****', toy, toyId)
            return board
      } catch (error) {
            logger.error(`while finding board ${boardId}`, err)
            throw err
      }
}

async function add(board) {
      try {
            // peek only updatable fields!
            //     const boardToAdd = {
            //         byUserId: ObjectId(board.byUserId),
            //         aboutUserId: ObjectId(board.aboutUserId),
            //         txt: board.txt
            //     }
            const collection = await dbService.getCollection('board')
            await collection.insertOne(board)
            return board;
      } catch (err) {
            logger.error('cannot insert board', err)
            throw err
      }
}

async function update(board) {
      try {
            board._id = ObjectId(board._id)
            const collection = await dbService.getCollection('board')
            await collection.updateOne({ '_id': board._id }, { $set: board })
            // console.log('updating board...')
            return board;
      } catch (error) {
            logger.error(`cannot update board ${board._id}`, err)
            throw err
      }
}

async function remove(boardId) {
      try {
            //   const store = asyncLocalStorage.getStore()
            //   const { userId, isAdmin } = store
            const collection = await dbService.getCollection('board')
            // remove only if user is owner/admin
            const query = { _id: ObjectId(boardId) }
            //   if (!isAdmin) query.byUserId = ObjectId(userId)
            await collection.deleteOne(query)
            // return await collection.deleteOne({ _id: ObjectId(boardId), byUserId: ObjectId(userId) })
      } catch (err) {
            logger.error(`cannot remove board ${boardId}`, err)
            throw err
      }
}

function _buildCriteria(filterBy) {
      const criteria = {}
      return criteria
}

module.exports = {
      query,
      getById,
      add,
      update,
      remove,
}


