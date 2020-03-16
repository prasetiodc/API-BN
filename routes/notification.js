const router = require('express').Router()
const notificationController = require('../controllers/notification')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.get('/', notificationController.findAll)

module.exports = router
