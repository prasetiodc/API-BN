const { tbl_retailers } = require('../models')

class retailer {
  static async create(req, res) {
    try {
      let newData = {
        retailer_name: req.body.name,
        initial: req.body.initial,
        total_store: 0
      }
      let createRetailer = await tbl_retailers.create(newData)

      let dataReturn = await tbl_retailers.findOne({
        where: { id: createRetailer.id },
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
      let allRetailer = await tbl_retailers.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      res.status(200).json({ message: "Success", total_data: allRetailer.length, data: allRetailer })
    } catch (err) {
      res.status(500).json({ message: "Error", err })
    }
  }

  static async findOne(req, res) {
    try {
      let allRetailer = await tbl_retailers.findByPk(req.params.id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      if (allRetailer) res.status(200).json({ message: "Success", data: allRetailer })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async update(req, res) {
    try {
      let newDate = {
        retailer_name: req.body.name,
        initial: req.body.initial,
        total_store: req.body.total_store
      }
      await tbl_retailers.update(newDate, { where: { id: req.params.id } })

      let dataReturn = await tbl_retailers.findByPk(req.params.id, {
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
      let deleteRetailer = await tbl_retailers.destroy({ where: { id: req.params.id } })

      if (deleteRetailer) res.status(200).json({ message: "Success", id_deleted: req.params.id })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = retailer