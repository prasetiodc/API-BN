const router = require('express').Router()
const uploadController = require('../controllers/upload')
const { authentication } = require('../middlewares/auth')
const { uploadAny } = require('../middlewares/multer')

router.use(authentication)
router.post('/', uploadAny.single('file'), uploadController.create)
router.get('/', uploadController.findAll)

module.exports = router
