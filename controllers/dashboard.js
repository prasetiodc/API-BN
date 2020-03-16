const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types } = require('../models')
const Op = require('sequelize').Op

class dashboard {
  static async findAll(req, res) {
    try {
      let allDataVisit
      if (req.query) {
        let conditionInTblVisit = {}, conditionInTblStore = {}, conditionInTblRetailer = {}, conditionInTblUser = {}, conditionInTblDC = {}, conditionInTblFictureType = {}

        // Filter supervisior
        if (req.query.month) conditionInTblVisit.visit_date = {
          [Op.and]: {
            [Op.gte]: `${new Date().getFullYear()}-${req.query.month}-01`,
            [Op.lte]: `${new Date().getFullYear()}-${Number(req.query.month) + 1}-01`
          }
        }
        if (req.query.brand) {
          if (req.query.brand === 'Google') {
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
          } else if (req.query.brand === 'Spotify') {
            conditionInTblVisit[Op.or] = [
              { entry_spotify1M: 1 },
              { entry_spotify3M: 1 },
              { exit_spotify1M: 1 },
              { exit_spotify3M: 1 }
            ]
          }

        }
        if (req.query.retailer) conditionInTblRetailer.id = req.query.retailer
        if (req.query.store) conditionInTblStore.store_code = req.query.store
        if (req.query.md) conditionInTblUser.id = req.query.md
        if (req.query.dc) conditionInTblDC.id = req.query.dc
        if (req.query.fixture) conditionInTblFictureType.id = req.query.fixture

        allDataVisit = await tbl_visits.findAll({
          where: conditionInTblVisit,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          order: [
            ['visit_date', 'ASC'],
          ],
          include: [{
            required: true,
            model: tbl_fixture_types,
            where: conditionInTblFictureType,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            required: true,
            model: tbl_users,
            where: conditionInTblUser,
            attributes: ['id', 'name']
          }, {
            required: true,
            model: tbl_stores,
            where: conditionInTblStore,
            attributes: ['store_code', 'store_name'],
            include: [{
              required: true,
              model: tbl_dcs,
              where: conditionInTblDC,
              exclude: ['createdAt', 'updatedAt']
            }, {
              required: true,
              model: tbl_retailers,
              where: conditionInTblRetailer,
              exclude: ['createdAt', 'updatedAt']
            }]
          }]
        })


      } else {
        allDataVisit = await tbl_visits.findAll({
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
            model: tbl_fixture_types,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_users,
            attributes: ['id', 'name']
          }, {
            model: tbl_stores,
            attributes: ['store_code', 'store_name'],
            include: [{
              model: tbl_dcs,
              exclude: ['createdAt', 'updatedAt']
            }, {
              model: tbl_retailers,
              exclude: ['createdAt', 'updatedAt']
            }]
          }]
        })
      }

      let totalAllStore = await tbl_retailers.sum('total_store')

      let PODCompliance = {}, POPCompliance = {}


      let counterEntryFixComp = 0, counterExitFixComp = 0, dataFixComp = [], counterEntryPOGComp = 0, counterExitPOGComp = 0, dataPOGComp = [], counterPromotionAwareness = 0, dataPromotionAwareness = [], counterComplaintHandling = 0, dataComplaintHandling = [], counterActivationKnowHow = 0, dataActivationKnowHow = [], counterEntryInstockCompliance = 0, counterExitInstockCompliance = 0, dataInstockCompliance = []

      allDataVisit.forEach(element => {
        // for diagram 2
        if (Number(element.entry_fixture_comp) === 1 || Number(element.exit_fixture_comp) === 1) {
          if (Number(element.entry_fixture_comp) === 1) counterEntryFixComp++
          if (Number(element.exit_fixture_comp) === 1) counterExitFixComp++
          dataFixComp.push(element)
        }
        // for diagram 3
        if (Number(element.entry_pog_comp) === 1 || Number(element.exit_pog_comp) === 1) {
          if (Number(element.entry_pog_comp) === 1) counterEntryPOGComp++
          if (Number(element.exit_pog_comp) === 1) counterExitPOGComp++
          dataPOGComp.push(element)
        }


        // for diagram 6
        if (Number(element.entry_google50k) === 1 || Number(element.entry_google100k) === 1 || Number(element.entry_google150k) === 1 || Number(element.entry_google300k) === 1 || Number(element.entry_google500k) === 1 || Number(element.entry_spotify1M) === 1 || Number(element.entry_spotify3M) === 1 || Number(element.exit_google50k) === 1 || Number(element.exit_google100k) === 1 || Number(element.exit_google150k) === 1 || Number(element.exit_google300k) === 1 || Number(element.exit_google500k) === 1 || Number(element.exit_spotify1M) === 1 || Number(element.exit_spotify3M) === 1) {
          if (Number(element.entry_google50k) === 1 || Number(element.entry_google100k) === 1 || Number(element.entry_google150k) === 1 || Number(element.entry_google300k) === 1 || Number(element.entry_google500k) === 1 || Number(element.entry_spotify1M) === 1 || Number(element.entry_spotify3M) === 1) {
            counterEntryInstockCompliance++
          } else {
            counterExitInstockCompliance++
          }
          dataInstockCompliance.push(element)
        }
        // for diagram 7
        if (Number(element.q1) === 1) {
          counterActivationKnowHow++
          dataActivationKnowHow.push(element)
        }
        // for diagram 8
        if (Number(element.q4) === 1) {
          counterPromotionAwareness++
          dataPromotionAwareness.push(element)
        }
        //for diagram 9
        if (Number(element.q3) === 1) {
          counterComplaintHandling++
          dataComplaintHandling.push(element)
        }
      });

      // for diagram 1
      let visitCompliance = {
        total_all_store: totalAllStore,
        store_has_visit: allDataVisit.length,
        persen: (allDataVisit.length / totalAllStore) * 100,
        allDataVisit
      }
      // for diagram 2
      let fixtureCompliance = {
        entry: (counterEntryFixComp / allDataVisit.length) * 100,
        exit: (counterExitFixComp / allDataVisit.length) * 100,
        dataFixComp
      }
      // for diagram 3
      let POGCompliance = {
        entry: (counterEntryPOGComp / allDataVisit.length) * 100,
        exit: (counterExitPOGComp / allDataVisit.length) * 100,
        dataPOGComp
      }


      // for diagram 6
      let instockCompliance
      if (req.query.brand) {
        if (req.query.brand === 'Google') {
          instockCompliance = {
            entryInstockCompliance: (counterEntryInstockCompliance / (allDataVisit.length * 5)) * 100,
            exitInstockCompliance: (counterExitInstockCompliance / (allDataVisit.length * 5)) * 100,
            dataInstockCompliance
          }
        } else if (req.query.brand === 'Spotify') {
          instockCompliance = {
            entryInstockCompliance: (counterEntryInstockCompliance / (allDataVisit.length * 2)) * 100,
            exitInstockCompliance: (counterExitInstockCompliance / (allDataVisit.length * 2)) * 100,
            dataInstockCompliance
          }
        }
      } else {
        instockCompliance = {
          entryInstockCompliance: (counterEntryInstockCompliance / (allDataVisit.length * 7)) * 100,
          exitInstockCompliance: (counterExitInstockCompliance / (allDataVisit.length * 7)) * 100,
          dataInstockCompliance
        }
      }
      //for diagram 7
      let activationKnowHow = {
        persen: (counterActivationKnowHow / allDataVisit.length) * 100,
        dataActivationKnowHow
      }
      // for diagram 8
      let promotionAwareness = {
        persen: (counterPromotionAwareness / allDataVisit.length) * 100,
        dataPromotionAwareness
      }
      // for diagram 9
      let complaintHandling = {
        persen: (counterComplaintHandling / allDataVisit.length) * 100,
        dataComplaintHandling
      }


      res.status(200).json({
        message: "Success", diagram: {
          visitCompliance, fixtureCompliance, POGCompliance, instockCompliance, activationKnowHow, promotionAwareness, complaintHandling
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = dashboard