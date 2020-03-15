const { tbl_fixture_types } = require('../models')

class fixtureType {
  static async create(req, res) {
    try {
      let newData = {
        fixture_type: req.body.fixture_type,
        google_50k: req.body.google_50k,
        google_100k: req.body.google_100k,
        google_150k: req.body.google_150k,
        google_300k: req.body.google_300k,
        google_500k: req.body.google_500k,
        spotify_1m: req.body.spotify_1m,
        spotify_3m: req.body.spotify_3m
      }
      let createFixtureType = await tbl_fixture_types.create(newData)

      let dataReturn = await tbl_fixture_types.findOne({
        where: { id: createFixtureType.id },
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
      let allRetailer = await tbl_fixture_types.findAll({
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
      let allRetailer = await tbl_fixture_types.findByPk(req.params.id, {
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
      await tbl_fixture_types.update(newDate, { where: { id: req.params.id } })

      let dataReturn = await tbl_fixture_types.findByPk(req.params.id, {
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
      let deleteRetailer = await tbl_fixture_types.destroy({ where: { id: req.params.id } })

      if (deleteRetailer) res.status(200).json({ message: "Success", id_deleted: req.params.id })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = fixtureType