const { user } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const { checkPass } = require('../helpers/checkPassword')

class userController {
  static async signup(req, res) {
    try {
      if (checkPass(req.body.password)) {
        let newUser = {
          nik: req.body.nik,
          name: req.body.name,
          email: req.body.email,
          password: hash(req.body.password),
          role_id: req.body.role || 2,
        }
        let createUser = await user.create(newUser)

        let dataReturn = await user.findByPk(createUser.null, { exclude: ['password'] })
        console.log("MASUK")
        res.status(201).json({ message: "Success", dataReturn })
      } else {
        throw "password format invalid"
      }
    } catch (err) {
      if (err === "password format invalid") res.status(400).json({ message: "Format password invalid" })
      console.log(err)
    }
    // let newUser = {
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password
    // }
    // modelUser.create(newUser)
    //   .then(data => {
    //     res.status(201).json(data)
    //   })
    //   .catch(err => {
    //     res.status(500).json({ err })
    //   })
  }

  // static signin(req, res) {
  //   modelUser.findOne({ email: req.body.email })
  //     .then(userFound => {
  //       if (userFound) {
  //         if (compare(req.body.password, userFound.password)) {
  //           let token = sign({ _id: userFound._id, name: userFound.name, email: userFound.email })
  //           res.status(200).json({ token, userId: userFound._id, userName: userFound.name })
  //         } else {
  //           res.status(400).json({ msg: "Bad request" })
  //         }
  //       } else {
  //         res.status(400).json({ msg: "Bad request" })
  //       }
  //     })
  //     .catch(err => {
  //       res.status(500).json(err)
  //     })
  // }

}

module.exports = userController
