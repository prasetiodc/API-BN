const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types } = require('../models')
const Op = require('sequelize').Op

class galery {
  static async findAll(req, res) {
    try {
      let allDataVisit
      if (req.query.month || req.query.brand || req.query.retailer || req.query.store || req.query.md || req.query.dc || req.query.fixture) {
        let conditionInTblVisit = {}, conditionInTblStore = {}, conditionInTblRetailer = {}, conditionInTblUser = {}, conditionInTblDC = {}, conditionInTblFixtureType = {}

        if (req.query.month) conditionInTblVisit.visit_date = {
          [Op.and]: {
            [Op.gte]: new Date(`${new Date().getFullYear()}-${req.query.month}-01`),
            [Op.lte]: new Date(`${new Date().getFullYear()}-${Number(req.query.month) + 1}-01`)
          }
        }
        if (req.query.brand) {
          if (req.query.brand.toLowerCase() === 'google') {
            conditionInTblVisit[Op.or] = [
              { entry_google50k: 1 },
              { entry_google100k: 1 },
              { entry_google150k: 1 },
              { entry_google300k: 1 },
              { entry_google500k: 1 },
              { exit_google50k: 1 },
              { exit_google100k: 1 },
              { exit_google150k: 1 },
              { exit_google300k: 1 },
              { exit_google500k: 1 }
            ]
          } else if (req.query.brand.toLowerCase() === 'spotify') {
            conditionInTblVisit[Op.or] = [
              { entry_spotify1M: 1 },
              { entry_spotify3M: 1 },
              { exit_spotify1M: 1 },
              { exit_spotify3M: 1 }
            ]
          }

        }
        if (req.query.retailer) conditionInTblRetailer.id = Number(req.query.retailer)
        if (req.query.store) conditionInTblStore.store_code = req.query.store
        if (req.query.md) conditionInTblUser.id = Number(req.query.md)
        if (req.query.dc) conditionInTblDC.id = Number(req.query.dc)
        if (req.query.fixture) {
          conditionInTblFixtureType = {
            [Op.or]: [
              { fixture_type_id_1: Number(req.query.fixture) },
              { fixture_type_id_2: Number(req.query.fixture) },
            ]
          }
        }

        allDataVisit = await tbl_visits.findAll({
          where: conditionInTblVisit,
          attributes: ['id_visit', 'img_store', 'img_fixture_in', 'img_fixture_out', 'visit_date'],
          order: [
            ['visit_date', 'ASC'],
          ],
          include: [{
            model: tbl_users,
            where: conditionInTblUser,
            attributes: ['id', 'name']
          }, {
            model: tbl_stores,
            where: conditionInTblStore,
            attributes: ['store_code', 'store_name', 'city'],
            include: [{
              model: tbl_dcs,
              where: conditionInTblDC,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }, {
              model: tbl_retailers,
              where: conditionInTblRetailer,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }, {
              model: tbl_fixture_types,
              as: "fixtureType1",
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }, {
              model: tbl_fixture_types,
              as: "fixtureType2",
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }]
          }]
        })
      } else {
        allDataVisit = await tbl_visits.findAll({
          attributes: ['id_visit', 'img_store', 'img_fixture_in', 'img_fixture_out', 'visit_date'],
          include: [{
            model: tbl_users,
            attributes: ['id', 'name']
          }, {
            model: tbl_stores,
            attributes: ['store_code', 'store_name', 'city'],
            include: [{
              model: tbl_dcs,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }, {
              model: tbl_retailers,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }, {
              model: tbl_fixture_types,
              as: "fixtureType1",
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }, {
              model: tbl_fixture_types,
              as: "fixtureType2",
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }]
          }]
        })
      }

      res.status(200).json({ message: "Success", total_data: allDataVisit.length, data: allDataVisit })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = galery