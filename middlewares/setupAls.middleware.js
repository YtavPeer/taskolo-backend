const logger = require('../services/logger.service')
const asyncLocalStorage = require('../services/als.service')

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {}
  asyncLocalStorage.run(storage, () => {
    console.log('reqqqqqqqqqqqqqqqqqqq ', req.sessionID)
    if (req.sessionID) {
      const alsStore = asyncLocalStorage.getStore()
      alsStore.sessionId = req.sessionID
      // if (req.session.user) {
      //   alsStore.userId = req.session.user._id
      //   alsStore.isAdmin = req.session.user.isAdmin
      // }
<<<<<<< HEAD
=======
      
>>>>>>> 1c4caff2949cd4466cdfd340118769354c6b5b77
    }
    next()
  })
}

module.exports = setupAsyncLocalStorage

