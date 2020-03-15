const router = require('express').Router()
const storeController = require('../controllers/store')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.post('/', storeController.create)
router.get('/', storeController.findAll)
router.get('/:id', storeController.findOne)
router.put('/:id', storeController.update)
router.delete('/:id', storeController.delete)

module.exports = router
