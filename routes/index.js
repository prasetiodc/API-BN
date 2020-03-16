const router = require('express').Router()
const user = require('./user')
const retailer = require('./retailer')
const store = require('./store')
const visit = require('./visit')
const galery = require('./galery')
const report = require('./report')
const dashboard = require('./dashboard')
const dc = require('./dc')
const fixtureType = require('./fixtureType')
const upload = require('./upload')
const notification = require('./notification')


router.get('/', (req, res) => res.send("WELCOME TO API BLACKHAWK NETWORK"))

router.use('/user', user)
router.use('/retailer', retailer)
router.use('/store', store)
router.use('/visit', visit)
router.use('/galery', galery)
router.use('/report', report)
router.use('/dashboard', dashboard)
router.use('/dc', dc)
router.use('/fixture-type', fixtureType)
router.use('/upload', upload)
router.use('/notification', notification)

module.exports = router