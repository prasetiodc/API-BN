const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types, tbl_visit_fixtures } = require('../models')
const Op = require('sequelize').Op

class dashboard {
  static async findAll(req, res) {
    try {
      let allDataVisit
      console.log(req.query)
      if (req.query.month) {
        let conditionInTblVisit = {}, conditionInTblStore = {}, conditionInTblRetailer = {}, conditionInTblUser = {}, conditionInTblDC = {}, conditionInTblFixtureType1 = {}, conditionInTblFixtureType2 = {}

        // Filter supervisior
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
          conditionInTblFixtureType1.fixture_type_id_1 = Number(req.query.fixture)
          conditionInTblFixtureType2.fixture_type_id_2 = Number(req.query.fixture)
        }

        console.log("conditionInTblVisit", conditionInTblVisit)
        console.log("conditionInTblStore", conditionInTblStore)
        console.log("conditionInTblRetailer", conditionInTblRetailer)
        console.log("conditionInTblUser", conditionInTblUser)
        console.log("conditionInTblDC", conditionInTblDC)
        console.log("conditionInTblFixtureType1", conditionInTblFixtureType1)
        console.log("conditionInTblFixtureType2", conditionInTblFixtureType2)

        allDataVisit = await tbl_visits.findAll({
          where: conditionInTblVisit,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          order: [
            ['visit_date', 'ASC'],
          ],
          include: [{
            model: tbl_visit_fixtures,
            where: {
              [Op.or]: [
                conditionInTblFixtureType1,
                conditionInTblFixtureType2
              ]
            },
            include: [{
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
            }],
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_users,
            where: conditionInTblUser,
            attributes: ['id', 'name']
          }, {
            model: tbl_stores,
            where: conditionInTblStore,
            attributes: ['store_code', 'store_name'],
            include: [{
              model: tbl_dcs,
              where: conditionInTblDC,
              exclude: ['createdAt', 'updatedAt']
            }, {
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
            model: tbl_visit_fixtures,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            include: [{
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

      let counterEntryFixComp = 0, counterExitFixComp = 0, dataFixComp = [], counterEntryPOGComp = 0, counterExitPOGComp = 0, dataPOGComp = [], counterPromotionAwareness = 0, dataPromotionAwareness = [], counterComplaintHandling = 0, dataComplaintHandling = [], counterActivationKnowHow = 0, dataActivationKnowHow = [], counterEntryInstockCompliance = 0, counterExitInstockCompliance = 0, dataInstockCompliance = [], counterEntryPODCompliance = 0, counterExitPODCompliance = 0, dataPODCompliance = [], counterEntryPOPCompliance = 0, counterExitPOPCompliance = 0, dataPOPCompliance = []

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
        //for diagram 4
        if (element.tbl_visit_fixture) {
          let pembagi = 0, tempEntry = 0, tempExit = 0
          if (element.tbl_visit_fixture.fixtureType1 !== null) {
            pembagi += (Number(element.tbl_visit_fixture.fixtureType1.google_50k) +
              Number(element.tbl_visit_fixture.fixtureType1.google_100k) +
              Number(element.tbl_visit_fixture.fixtureType1.google_150k) +
              Number(element.tbl_visit_fixture.fixtureType1.google_300k) +
              Number(element.tbl_visit_fixture.fixtureType1.google_500k) +
              Number(element.tbl_visit_fixture.fixtureType1.spotify_1m) +
              Number(element.tbl_visit_fixture.fixtureType1.spotify_3m))
          }
          if (element.tbl_visit_fixture.fixtureType2 !== null) {
            pembagi += (Number(element.tbl_visit_fixture.fixtureType2.google_50k) +
              Number(element.tbl_visit_fixture.fixtureType2.google_100k) +
              Number(element.tbl_visit_fixture.fixtureType2.google_150k) +
              Number(element.tbl_visit_fixture.fixtureType2.google_300k) +
              Number(element.tbl_visit_fixture.fixtureType2.google_500k) +
              Number(element.tbl_visit_fixture.fixtureType2.spotify_1m) +
              Number(element.tbl_visit_fixture.fixtureType2.spotify_3m))
          }

          tempEntry = Number(element.entry_remaining_google50k) + Number(element.entry_remaining_google100k) + Number(element.entry_remaining_google150k) + Number(element.entry_remaining_google300k) + Number(element.entry_remaining_google500k) + Number(element.entry_remaining_spotify1m) + Number(element.entry_remaining_spotify3m)

          tempExit = Number(element.exit_remaining_google50k) + Number(element.exit_remaining_google100k) + Number(element.exit_remaining_google150k) + Number(element.exit_remaining_google300k) + Number(element.exit_remaining_google500k) + Number(element.exit_remaining_spotify1m) + Number(element.exit_remaining_spotify3m)

          counterEntryPODCompliance += (tempEntry / pembagi)
          counterExitPODCompliance += (tempExit / pembagi)
          dataPODCompliance.push(element)
        }
        //for diagram 5
        if (Number(element.entry_pop_pic_1) == 1 || Number(element.entry_pop_pic_2) == 1 || Number(element.exit_pop_pic_1) == 1 || Number(element.exit_pop_pic_2) == 1) {
          let tempCounterEntry = 0, tempCounterExit = 0

          if (Number(element.tbl_store.retailer_id) === 1) {  // 1=IDN, 2=SAT, 3=MIDI
            if (Number(element.entry_pop_pic_1) === 1) tempCounterEntry++
            if (Number(element.entry_pop_pic_2) === 1) tempCounterEntry++
            counterEntryPOPCompliance += (tempCounterEntry / 2)

            if (Number(element.exit_pop_pic_1) === 1) tempCounterExit++
            if (Number(element.exit_pop_pic_2) === 1) tempCounterExit++
            counterExitPOPCompliance += (tempCounterExit / 2)

            dataPOPCompliance.push(element)
          } else if (Number(element.tbl_store.retailer_id) === 2 || Number(element.tbl_store.retailer_id) === 3) {
            if (Number(element.entry_pop_pic_1) === 1 || Number(element.entry_pop_pic_2) === 1) tempCounterEntry++
            counterEntryPOPCompliance += tempCounterEntry

            if (Number(element.exit_pop_pic_1) === 1 || Number(element.exit_pop_pic_2) === 1) tempCounterExit++
            counterExitPOPCompliance += tempCounterExit

            dataPOPCompliance.push(element)
          }

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
        if (Number(element.q2) === 1) {
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
      //for diagram 4
      let PODCompliance = {
        entry: (counterEntryPODCompliance / allDataVisit.length) * 100,
        exit: (counterExitPODCompliance / allDataVisit.length) * 100,
        dataPODCompliance
      }
      //for diagram 5
      let POPCompliance = {
        entry: (counterEntryPOPCompliance / allDataVisit.length) * 100,
        exit: (counterExitPOPCompliance / allDataVisit.length) * 100,
        dataPOPCompliance
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
        message: "Success", data_length: allDataVisit.length, data: allDataVisit, diagram: {
          visitCompliance, fixtureCompliance, POGCompliance, PODCompliance, POPCompliance, instockCompliance, activationKnowHow, promotionAwareness, complaintHandling
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = dashboard