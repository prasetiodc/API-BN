const { tbl_users, tbl_roles } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const Op = require('sequelize').Op

class user {
  static async signup(req, res) {
    try {
      if (!req.body.email || req.body.email === "") {
        throw 'email tidak boleh kosong'
      } else {
        let newUser = {
          nik: req.body.nik,
          name: req.body.name,
          email: req.body.email,
          password: hash(req.body.password),
          role_id: req.body.role || 2,
        }

        await tbl_users.create(newUser)

        let dataReturn = await tbl_users.findOne({
          where: { nik: req.body.nik },
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'role_id', 'login_date']
          }
        })

        res.status(201).json({ message: "Success", data: dataReturn })
      }
    } catch (err) {
      console.log(err)
      if (err === 'email tidak boleh kosong') res.status(400).json({ message: "Email must be added" })
      else if (err.message === "Validation error") res.status(400).json({ message: "NIK/Email must be unique" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async signin(req, res) {
    try {
      let userData = await tbl_users.findOne({ where: { email: req.body.email } })

      if (userData) {
        if (compare(req.body.password, userData.password)) {
          await tbl_users.update({ login_date: new Date() }, { where: { id: userData.id } })

          let token = sign({ id: userData.id, name: userData.name, email: userData.email })

          res.status(200).json({
            token,
            user_id: userData.id,
            name: userData.name,
            role_id: userData.role_id
          })
        } else {
          throw "not found"
        }
      } else {
        throw "bad request"
      }
    } catch (err) {
      console.log(err)
      if (err === "not found") res.status(404).json({ message: "Not found" })
      else if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async findAll(req, res) {
    try {
      let allUsers
      if (req.query.forOption === 'true') {
        allUsers = await tbl_users.findAll({
          where: {
            nik: { [Op.not]: '00000' }
          },
          attributes: ['id', 'nik']
        })

        let tempUser = []
        await allUsers.forEach(async user => {
          tempUser.push({ id: user.id, text: user.nik })
        });

        allUsers = tempUser
      } else {
        allUsers = await tbl_users.findAll({
          include: [{
            model: tbl_roles,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }],
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        })
      }

      res.status(200).json({ message: "Success", total_data: allUsers.length, data: allUsers })
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async findOne(req, res) {
    try {
      let allUsers = await tbl_users.findByPk(req.params.id, {
        include: [{
          model: tbl_roles,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }],
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      })

      if (allUsers) res.status(200).json({ message: "Success", data: allUsers })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async update(req, res) {
    try {
      let newUser = {
        name: req.body.name,
        email: req.body.email,
        role_id: req.body.role
      }

      if (req.body.password) newUser.password = hash(req.body.password)

      await tbl_users.update(newUser, { where: { id: req.params.id } })

      let dataReturn = await tbl_users.findByPk(req.params.id, {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'role_id', 'login_date']
        },
        include: [{
          model: tbl_roles,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }]
      })

      if (dataReturn) res.status(200).json({ message: "Success", data: dataReturn })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async delete(req, res) {
    try {
      let deleteUser = await tbl_users.destroy({ where: { id: req.params.id } })

      if (deleteUser) res.status(200).json({ message: "Success", id_deleted: req.params.id })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async checkToken(req, res) {
    try {
      let userData = await tbl_users.findByPk(req.user_id)

      if (userData) {
        res.status(200).json({
          user_id: userData.id,
          name: userData.name,
          role_id: userData.role_id
        })
      } else {
        throw "bad request"
      }
    } catch (err) {
      console.log(err)
      if (err === "not found") res.status(404).json({ message: "Not found" })
      else if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = user
