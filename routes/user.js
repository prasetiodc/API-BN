const router = require('express').Router()
const userController = require('../controllers/user')
const { authentication } = require('../middlewares/auth')

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

router.use(authentication)
router.get('/', userController.findAll)
router.get('/check-token', userController.checkToken)
router.get('/:id', userController.findOne)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)

module.exports = router
