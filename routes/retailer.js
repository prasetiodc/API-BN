const router = require('express').Router()
const retailerController = require('../controllers/retailer')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.post('/', retailerController.create)
router.get('/', retailerController.findAll)
router.get('/:id', retailerController.findOne)
router.put('/:id', retailerController.update)
router.delete('/:id', retailerController.delete)

module.exports = router
