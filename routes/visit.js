const router = require('express').Router()
const visitController = require('../controllers/visit')
const { authentication } = require('../middlewares/auth')
const { uploadAny } = require('../middlewares/multer')

router.use(authentication)
router.post('/', uploadAny.any('files'), visitController.create)
router.get('/', visitController.findAll)
router.get('/:id', visitController.findOne)
router.put('/:id', uploadAny.any('files'), visitController.update)
router.delete('/:id', visitController.delete)

module.exports = router
