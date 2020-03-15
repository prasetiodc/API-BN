const router = require('express').Router()
const dcController = require('../controllers/dc')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.post('/', dcController.create)
router.get('/', dcController.findAll)
router.get('/:id', dcController.findOne)
router.put('/:id', dcController.update)
router.delete('/:id', dcController.delete)

module.exports = router
