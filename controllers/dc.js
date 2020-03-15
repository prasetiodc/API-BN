const { tbl_dcs } = require('../models')

class dc {
  static async create(req, res) {
    try {
      let newData = {
        DC_name: req.body.DC_name
      }
      let createDC = await tbl_dcs.create(newData)

      let dataReturn = await tbl_dcs.findByPk(createDC.id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      res.status(201).json({ message: "Success", data: dataReturn })
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async findAll(req, res) {
    try {
      let allDC = await tbl_dcs.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      res.status(200).json({ message: "Success", total_data: allDC.length, data: allDC })
    } catch (err) {
      res.status(500).json({ message: "Error", err })
    }
  }

  static async findOne(req, res) {
    try {
      let dc = await tbl_dcs.findByPk(req.params.id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      if (dc) res.status(200).json({ message: "Success", data: dc })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async update(req, res) {
    try {
      await tbl_dcs.update({DC_name: req.body.DC_name}, { where: { id: req.params.id } })

      let dataReturn = await tbl_dcs.findByPk(req.params.id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
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
      let deleteDC = await tbl_dcs.destroy({ where: { id: req.params.id } })

      if (deleteDC) res.status(200).json({ message: "Success", id_deleted: req.params.id })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = dc