const router = require('express').Router()
const dashboardController = require('../controllers/dashboard')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.get('/', dashboardController.findAll)

module.exports = router
