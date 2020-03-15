const router = require('express').Router()
const reportController = require('../controllers/report')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.get('/', reportController.findAll)

module.exports = router
