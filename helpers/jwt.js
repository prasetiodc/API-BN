const jwt = require('jsonwebtoken')

module.exports = {
  sign(payload) {
    return jwt.sign(payload, process.env.SECRET_JWT)
  },
  verify(token, res) {
    if (token) {
      try {
        let verification = jwt.verify(token, process.env.SECRET_JWT)
        return verification
      } catch{
        res.status(401).json({ message: 'Unauthorized' })
      }
    }
  }
}