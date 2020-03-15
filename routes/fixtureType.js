const router = require('express').Router()
const fixtureTypeController = require('../controllers/fixtureType')
const { authentication } = require('../middlewares/auth')

router.use(authentication)
router.post('/', fixtureTypeController.create)
router.get('/', fixtureTypeController.findAll)
router.get('/:id', fixtureTypeController.findOne)
router.put('/:id', fixtureTypeController.update)
router.delete('/:id', fixtureTypeController.delete)

module.exports = router
