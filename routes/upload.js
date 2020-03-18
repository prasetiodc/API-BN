const router = require('express').Router()
const uploadController = require('../controllers/upload')
const { authentication } = require('../middlewares/auth')
const { uploadAny } = require('../middlewares/multer')

router.use(authentication)
router.post('/', uploadAny.any('files'), uploadController.create)
router.get('/', uploadController.findAll)

module.exports = router
