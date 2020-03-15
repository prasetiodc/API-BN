const { tbl_users } = require('../models')
const { verify } = require('../helpers/jwt')

function authentication(req, res, next) {
  let decoded = verify(req.headers.token);

  tbl_users.findByPk(decoded.id)
    .then(userFound => {
      if (userFound) {
        req.user_id = userFound.id
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}


module.exports = { authentication }

