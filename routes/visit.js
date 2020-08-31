const router = require('express').Router()
const visitController = require('../controllers/visit')
const { authentication } = require('../middlewares/auth')
const { uploadAny, uploadSingle } = require('../middlewares/multer')

router.use(authentication)
router.post('/', uploadAny.any(), visitController.create)
router.get('/', visitController.findAll)
router.post('/import', uploadSingle.single('files'), visitController.import)
router.get('/:id', visitController.findOne)
router.put('/:id', uploadAny.any(), visitController.update)
router.delete('/:id', visitController.delete)

module.exports = router
