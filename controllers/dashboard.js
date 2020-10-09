const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types } = require('../models')
const Op = require('sequelize').Op

class dashboard {
  static async findAll(req, res) {
    try {
      let allDataVisit
      if (req.query.month || req.query.brand || req.query.retailer || req.query.store || req.query.md || req.query.dc || req.query.fixture) {
        let conditionInTblVisit = {}, conditionInTblStore = {}, conditionInTblRetailer = {}, conditionInTblUser = {}, conditionInTblDC = {}, conditionInTblFixtureType = {}

        if (req.query.month) conditionInTblVisit.visit_date = {
          [Op.and]: {
            [Op.gte]: new Date(`${new Date().getFullYear()}-${Number(req.query.month) < 10 ? `0${Number(req.query.month)}` : Number(req.query.month)}-01`),
            [Op.lte]: new Date(`${new Date().getFullYear()}-${Number(req.query.month) + 1 < 10 ? `0${Number(req.query.month) + 1}` : Number(req.query.month) + 1}-01`)
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
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          order: [
            ['visit_date', 'ASC'],
          ],
          include: [{
            model: tbl_users,
            where: conditionInTblUser,
            attributes: ['id', 'name']
          }, {
            model: tbl_stores,
            where: { ...conditionInTblStore, ...conditionInTblFixtureType },
            attributes: ['store_code', 'store_name'],
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
            }],
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_fixture_types,
            as: "entry_correct_fixture_id",
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_fixture_types,
            as: "exit_correct_fixture_id",
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }]
        })
      } else {
        allDataVisit = await tbl_visits.findAll({
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
            model: tbl_users,
            attributes: ['id', 'name']
          }, {
            model: tbl_stores,
            attributes: ['store_code', 'store_name'],
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
          }, {
            model: tbl_fixture_types,
            as: "entry_correct_fixture_id",
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_fixture_types,
            as: "exit_correct_fixture_id",
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }]
        })
      }
      let AllStore = await tbl_stores.findAll()

      let totalAllStore = AllStore.length

      let counterEntryFixComp = 0, counterExitFixComp = 0, dataFixComp = [], counterEntryPOGComp = 0, counterExitPOGComp = 0, dataPOGComp = [], counterPromotionAwareness = 0, dataPromotionAwareness = [], counterComplaintHandling = 0, dataComplaintHandling = [], counterActivationKnowHow = 0, dataActivationKnowHow = [], counterEntryInstockCompliance = 0, counterExitInstockCompliance = 0, dataInstockCompliance = [], counterEntryPODCompliance = 0, counterExitPODCompliance = 0, dataPODCompliance = [], counterEntryPOPCompliance = 0, counterExitPOPCompliance = 0, dataPOPCompliance = [], dataDetail

      allDataVisit && allDataVisit.forEach(element => {
        // for diagram 2
        if (req.query.diagram === "fixture-compliance" || !req.query.diagram) {
          if (Number(element.entry_fixture_comp) === 1 || Number(element.exit_fixture_comp) === 1) {
            if (Number(element.entry_fixture_comp) === 1) counterEntryFixComp++
            if (Number(element.exit_fixture_comp) === 1) counterExitFixComp++
            if (req.query.diagram === "fixture-compliance") dataFixComp.push(element)
          }
        }
        // for diagram 3
        if ((req.query.diagram && req.query.diagram.toLowerCase() === "pog-compliance") || !req.query.diagram) {
          if (Number(element.entry_pog_comp) === 1 || Number(element.exit_pog_comp) === 1) {
            if (Number(element.entry_pog_comp) === 1) counterEntryPOGComp++
            if (Number(element.exit_pog_comp) === 1) counterExitPOGComp++
            if ((req.query.diagram && req.query.diagram.toLowerCase() === "pog-compliance")) dataPOGComp.push(element)
          }
        }
        //for diagram 4 
        if ((req.query.diagram && req.query.diagram.toLowerCase() === "pod-compliance") || !req.query.diagram) {
          if (Number(element.entry_peg_comp) === 1 || Number(element.exit_peg_comp) === 1) {
            if (Number(element.entry_peg_comp) === 1) counterEntryPODCompliance++
            if (Number(element.exit_peg_comp) === 1) counterExitPODCompliance++
            if ((req.query.diagram && req.query.diagram.toLowerCase() === "pod-compliance")) dataPODCompliance.push(element)
          }
        }
        //for diagram 5
        if ((req.query.diagram && req.query.diagram.toLowerCase() === "pop-compliance") || !req.query.diagram) {
          if (Number(element.entry_pop_pic_1) == 1 || Number(element.entry_pop_pic_2) == 1 || Number(element.exit_pop_pic_1) == 1 || Number(element.exit_pop_pic_2) == 1) {
            let tempCounterEntry = 0, tempCounterExit = 0

            if (Number(element.tbl_store.retailer_id) === 1) {  // 1=IDN, 2=SAT, 3=MIDI
              if (Number(element.entry_pop_pic_1) === 1) tempCounterEntry++
              if (Number(element.entry_pop_pic_2) === 1) tempCounterEntry++
              counterEntryPOPCompliance += (tempCounterEntry / 2)

              if (Number(element.exit_pop_pic_1) === 1) tempCounterExit++
              if (Number(element.exit_pop_pic_2) === 1) tempCounterExit++
              counterExitPOPCompliance += (tempCounterExit / 2)

              if ((req.query.diagram && req.query.diagram.toLowerCase() === "pop-compliance")) dataPOPCompliance.push(element)
            } else if (Number(element.tbl_store.retailer_id) === 2 || Number(element.tbl_store.retailer_id) === 3) {
              if (Number(element.entry_pop_pic_1) === 1) tempCounterEntry++
              counterEntryPOPCompliance += tempCounterEntry

              if (Number(element.exit_pop_pic_1) === 1) tempCounterExit++
              counterExitPOPCompliance += tempCounterExit

              if ((req.query.diagram && req.query.diagram.toLowerCase() === "pop-compliance")) dataPOPCompliance.push(element)
            }
          }
        }
        // for diagram 6
        if (req.query.diagram === "stock-compliance" || !req.query.diagram) {
          if (Number(element.entry_google50k) === 15 || Number(element.entry_google100k) === 15 || Number(element.entry_google150k) === 15 || Number(element.entry_google300k) === 15 || Number(element.entry_google500k) === 15 || Number(element.entry_spotify1M) === 15 || Number(element.entry_spotify3M) === 15 || Number(element.exit_google50k) === 15 || Number(element.exit_google100k) === 15 || Number(element.exit_google150k) === 15 || Number(element.exit_google300k) === 15 || Number(element.exit_google500k) === 15 || Number(element.exit_spotify1M) === 15 || Number(element.exit_spotify3M) === 15) {

            if (req.query.brand) {
              if (req.query.brand.toLowerCase() === 'google') {
                if (Number(element.entry_google50k) === 15) {
                  counterEntryInstockCompliance++
                }
                if (Number(element.entry_google100k) === 15) {
                  counterEntryInstockCompliance++
                }
                if (Number(element.entry_google150k) === 15) {
                  counterEntryInstockCompliance++
                }
                if (Number(element.entry_google300k) === 15) {
                  counterEntryInstockCompliance++
                }
                if (Number(element.entry_google500k) === 15) {
                  counterEntryInstockCompliance++
                }

                if (Number(element.exit_google50k) === 15) {
                  counterExitInstockCompliance++
                }
                if (Number(element.exit_google100k) === 15) {
                  counterExitInstockCompliance++
                }
                if (Number(element.exit_google150k) === 15) {
                  counterExitInstockCompliance++
                }
                if (Number(element.exit_google300k) === 15) {
                  counterExitInstockCompliance++
                }
                if (Number(element.exit_google500k) === 15) {
                  counterExitInstockCompliance++
                }

              } else if (req.query.brand.toLowerCase() === 'spotify') {
                if (Number(element.entry_spotify1M) === 15) {
                  counterEntryInstockCompliance++
                }
                if (Number(element.entry_spotify3M) === 15) {
                  counterEntryInstockCompliance++
                }
                if (Number(element.exit_spotify1M) === 15) {
                  counterExitInstockCompliance++
                }
                if (Number(element.exit_spotify3M) === 15) {
                  counterExitInstockCompliance++
                }
              }
            } else {
              if (Number(element.entry_google50k) === 15) {
                counterEntryInstockCompliance++
              }
              if (Number(element.entry_google100k) === 15) {
                counterEntryInstockCompliance++
              }
              if (Number(element.entry_google150k) === 15) {
                counterEntryInstockCompliance++
              }
              if (Number(element.entry_google300k) === 15) {
                counterEntryInstockCompliance++
              }
              if (Number(element.entry_google500k) === 15) {
                counterEntryInstockCompliance++
              }
              if (Number(element.entry_spotify1M) === 15) {
                counterEntryInstockCompliance++
              }
              if (Number(element.entry_spotify3M) === 15) {
                counterEntryInstockCompliance++
              }

              if (Number(element.exit_google50k) === 15) {
                counterExitInstockCompliance++
              }
              if (Number(element.exit_google100k) === 15) {
                counterExitInstockCompliance++
              }
              if (Number(element.exit_google150k) === 15) {
                counterExitInstockCompliance++
              }
              if (Number(element.exit_google300k) === 15) {
                counterExitInstockCompliance++
              }
              if (Number(element.exit_google500k) === 15) {
                counterExitInstockCompliance++
              }
              if (Number(element.exit_spotify1M) === 15) {
                counterExitInstockCompliance++
              }
              if (Number(element.exit_spotify3M) === 15) {
                counterExitInstockCompliance++
              }
            }

            if (req.query.diagram === "stock-compliance") dataInstockCompliance.push(element)
          }
        }
        // for diagram 7
        if (req.query.diagram === "activation-know-how" || !req.query.diagram) {
          if (Number(element.q1) === 1) {
            counterActivationKnowHow++
            if (req.query.diagram === "activation-know-how") dataActivationKnowHow.push(element)
          }
        }
        // for diagram 8
        if (req.query.diagram === "promotion-awareness" || !req.query.diagram) {
          if (Number(element.q2) === 1) {
            counterPromotionAwareness++
            if (req.query.diagram === "promotion-awareness") dataPromotionAwareness.push(element)
          }
        }
        //for diagram 9
        if (req.query.diagram === "complain-handling" || !req.query.diagram) {
          if (Number(element.q3) === 1) {
            counterComplaintHandling++
            if (req.query.diagram === "complain-handling") dataComplaintHandling.push(element)
          }
        }
      });

      // for diagram 1
      let visitCompliance = {
        total_all_store: totalAllStore,
        store_has_visit: allDataVisit.length,
        persen: (allDataVisit.length / totalAllStore) * 100
      }
      if (req.query.diagram === "visit-compliance") {
        visitCompliance.allDataVisit = allDataVisit
        dataDetail = visitCompliance
      }

      // for diagram 2
      let fixtureCompliance = {
        entry: (dataFixComp.length > 0 || !req.query.diagram) ? ((counterEntryFixComp / allDataVisit.length) * 100) : 0,
        exit: (dataFixComp.length > 0 || !req.query.diagram) ? ((counterExitFixComp / allDataVisit.length) * 100) : 0
      }
      if (req.query.diagram === "fixture-compliance") {
        fixtureCompliance.dataFixComp = dataFixComp
        dataDetail = fixtureCompliance
      }

      // for diagram 3
      let POGCompliance = {
        entry: (dataPOGComp.length > 0 || !req.query.diagram) ? ((counterEntryPOGComp / allDataVisit.length) * 100) : 0,
        exit: (dataPOGComp.length > 0 || !req.query.diagram) ? ((counterExitPOGComp / allDataVisit.length) * 100) : 0
      }
      if (req.query.diagram && req.query.diagram.toLowerCase() === "pog-compliance") {
        POGCompliance.dataPOGComp = dataPOGComp
        dataDetail = POGCompliance
      }

      //for diagram 4
      let PODCompliance = {
        entry: (dataPODCompliance.length > 0 || !req.query.diagram) ? ((counterEntryPODCompliance / allDataVisit.length) * 100) : 0,
        exit: (dataPODCompliance.length > 0 || !req.query.diagram) ? ((counterExitPODCompliance / allDataVisit.length) * 100) : 0,
      }
      if (req.query.diagram && req.query.diagram.toLowerCase() === "pod-compliance") {
        PODCompliance.dataPODCompliance = dataPODCompliance
        dataDetail = PODCompliance
      }

      //for diagram 5
      let POPCompliance = {
        entry: (dataPOPCompliance.length > 0 || !req.query.diagram) ? ((counterEntryPOPCompliance / allDataVisit.length) * 100) : 0,
        exit: (dataPOPCompliance.length > 0 || !req.query.diagram) ? ((counterExitPOPCompliance / allDataVisit.length) * 100) : 0,
      }
      if (req.query.diagram && req.query.diagram.toLowerCase() === "pop-compliance") {
        POPCompliance.dataPOPCompliance = dataPOPCompliance
        dataDetail = POPCompliance
      }

      // for diagram 6
      let instockCompliance
      if (req.query.brand) {
        if (req.query.brand.toLowerCase() === 'google') {
          instockCompliance = {
            entryInstockCompliance: (dataInstockCompliance.length > 0 || !req.query.diagram) ? ((counterEntryInstockCompliance / (allDataVisit.length * 5)) * 100) : 0,
            exitInstockCompliance: (dataInstockCompliance.length > 0 || !req.query.diagram) ? ((counterExitInstockCompliance / (allDataVisit.length * 5)) * 100) : 0
          }
        } else if (req.query.brand.toLowerCase() === 'spotify') {
          instockCompliance = {
            entryInstockCompliance: (dataInstockCompliance.length > 0 || !req.query.diagram) ? ((counterEntryInstockCompliance / (allDataVisit.length * 2)) * 100) : 0,
            exitInstockCompliance: (dataInstockCompliance.length > 0 || !req.query.diagram) ? ((counterExitInstockCompliance / (allDataVisit.length * 2)) * 100) : 0
          }
        }
      } else {
        instockCompliance = {
          entryInstockCompliance: (dataInstockCompliance.length > 0 || !req.query.diagram) ? ((counterEntryInstockCompliance / (allDataVisit.length * 7)) * 100) : 0,
          exitInstockCompliance: (dataInstockCompliance.length > 0 || !req.query.diagram) ? ((counterExitInstockCompliance / (allDataVisit.length * 7)) * 100) : 0,
        }
      }
      if (req.query.diagram === "stock-compliance") {
        instockCompliance.dataInstockCompliance = dataInstockCompliance
        dataDetail = instockCompliance
      }

      //for diagram 7
      let activationKnowHow = {
        persen: (dataActivationKnowHow.length > 0 || !req.query.diagram) ? ((counterActivationKnowHow / allDataVisit.length) * 100) : 0,
      }
      if (req.query.diagram === "activation-know-how") {
        activationKnowHow.dataActivationKnowHow = dataActivationKnowHow
        dataDetail = activationKnowHow
      }

      // for diagram 8
      let promotionAwareness = {
        persen: (dataPromotionAwareness.length > 0 || !req.query.diagram) ? ((counterPromotionAwareness / allDataVisit.length) * 100) : 0,
      }
      if (req.query.diagram === "promotion-awareness") {
        promotionAwareness.dataPromotionAwareness = dataPromotionAwareness
        dataDetail = promotionAwareness
      }

      // for diagram 9
      let complaintHandling = {
        persen: (dataComplaintHandling.length > 0 || !req.query.diagram) ? ((counterComplaintHandling / allDataVisit.length) * 100) : 0,
      }
      if (req.query.diagram === "complain-handling") {
        complaintHandling.dataComplaintHandling = allDataVisit
        dataDetail = complaintHandling
      }

      if (!req.query.diagram) {
        res.status(200).json({
          message: "Success", data_length: allDataVisit.length, diagram: {
            visitCompliance, fixtureCompliance, POGCompliance, PODCompliance, POPCompliance, instockCompliance, activationKnowHow, promotionAwareness, complaintHandling
          }
        })
      } else {
        res.status(200).json({
          message: "Success", ...dataDetail
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = dashboard