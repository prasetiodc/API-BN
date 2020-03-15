const router = require('express').Router()
const galeryController = require('../controllers/galery')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.get('/', galeryController.findAll)

module.exports = router
