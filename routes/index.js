const router = require('express').Router()
const user = require('./user')

router.get('/', (req, res) => res.send("WELCOME TO API BLACKHAWK NETWORK"))

router.use('/user', user)

module.exports = router