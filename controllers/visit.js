const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types, tbl_visit_fixtures } = require('../models')
const moment = require('moment')

class visit {
  static async create(req, res) {

    let img_store, img_fixture_in, img_fixture_out

    if (req.files.length != 0) {
      img_store = req.files.find(el => el.originalname === 'img_store')
      img_fixture_in = req.files.find(el => el.originalname === 'img_fixture_in')
      img_fixture_out = req.files.find(el => el.originalname === 'img_fixture_out')
    }

    try {
      let dataStore = await tbl_stores.findByPk(req.body.store_code)
      let isTrueFixtureType = false

      if (Number(dataStore.retailer_id) === 1 &&
        Number(req.body.fixture_type_id_1) !== 3 && Number(req.body.fixture_type_id_1) !== 6 &&
        Number(req.body.fixture_type_id_2) !== 3 && Number(req.body.fixture_type_id_2) !== 6) {
        isTrueFixtureType = true
      } else if ((Number(dataStore.retailer_id) === 2 &&
        Number(req.body.fixture_type_id_1) === 3) ||
        (Number(dataStore.retailer_id) === 2 &&
          Number(req.body.fixture_type_id_2) === 3)) {
        isTrueFixtureType = true
      } else if ((Number(dataStore.retailer_id) === 3 &&
        Number(req.body.fixture_type_id_1) === 6) &&
        (Number(dataStore.retailer_id) === 3 &&
          Number(req.body.fixture_type_id_2) === 6)) {
        isTrueFixtureType = true
      }

      if (isTrueFixtureType) {
        let newFixture = {
          fixture_type_id_1: req.body.fixture_type_id_1,
          fixture_type_id_2: req.body.fixture_type_id_2
        }
        let visitFixture = await tbl_visit_fixtures.create(newFixture)

        let newData = {
          img_store: img_store ? img_store : (req.files[0] ? req.files[0].path : ""),
          img_fixture_in: img_fixture_in ? img_fixture_in : (req.files[1] ? req.files[1].path : ""),
          img_fixture_out: img_fixture_out ? img_fixture_out : (req.files[2] ? req.files[2].path : ""),
          visit_date: new Date(req.body.visit_date),
          user_id: req.user_id,
          store_code: req.body.store_code,
          visit_fixture_id: visitFixture.id,
          entry_fixture_comp: req.body.entry_fixture_comp,
          entry_peg_comp: req.body.entry_peg_comp,
          entry_pog_comp: req.body.entry_pog_comp,
          entry_pop_pic_1: req.body.entry_pop_pic_1,
          entry_pop_pic_2: req.body.entry_pop_pic_2,
          entry_google50k: req.body.entry_google50k,
          entry_google100k: req.body.entry_google100k,
          entry_google150k: req.body.entry_google150k,
          entry_google300k: req.body.entry_google300k,
          entry_google500k: req.body.entry_google500k,
          entry_spotify1M: req.body.entry_spotify1M,
          entry_spotify3M: req.body.entry_spotify3M,
          exit_fixture_comp: req.body.exit_fixture_comp,
          exit_peg_comp: req.body.exit_peg_comp,
          exit_pog_comp: req.body.exit_pog_comp,
          exit_pop_pic_1: req.body.exit_pop_pic_1,
          exit_pop_pic_2: req.body.exit_pop_pic_2,
          exit_google50k: req.body.exit_google50k,
          exit_google100k: req.body.exit_google100k,
          exit_google150k: req.body.exit_google150k,
          exit_google300k: req.body.exit_google300k,
          exit_google500k: req.body.exit_google500k,
          exit_spotify1M: req.body.exit_spotify1M,
          exit_spotify3M: req.body.exit_spotify3M,
          assistants_name: req.body.assistants_name,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          entry_remaining_google50k: req.body.entry_remaining_google50k,
          entry_remaining_google100k: req.body.entry_remaining_google100k,
          entry_remaining_google150k: req.body.entry_remaining_google150k,
          entry_remaining_google300k: req.body.entry_remaining_google300k,
          entry_remaining_google500k: req.body.entry_remaining_google500k,
          entry_remaining_spotify1m: req.body.entry_remaining_spotify1m,
          entry_remaining_spotify3m: req.body.entry_remaining_spotify3m,
          exit_remaining_google50k: req.body.exit_remaining_google50k,
          exit_remaining_google100k: req.body.exit_remaining_google100k,
          exit_remaining_google150k: req.body.exit_remaining_google150k,
          exit_remaining_google300k: req.body.exit_remaining_google300k,
          exit_remaining_google500k: req.body.exit_remaining_google500k,
          exit_remaining_spotify1m: req.body.exit_remaining_spotify1m,
          exit_remaining_spotify3m: req.body.exit_remaining_spotify3m
        }
        let createVisit = await tbl_visits.create(newData)

        let dataReturn = await tbl_visits.findOne({
          where: { id_visit: createVisit.null },
          order: [
            ['id_visit', 'DESC']
          ],
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
            model: tbl_stores,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            include: [{
              model: tbl_dcs,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              }
            }, {
              model: tbl_retailers,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }]
          }]
        })

        res.status(201).json({ message: "Success", data: dataReturn })
      } else {
        throw "fixture_type_id tidak sesuai ketentuan"
      }
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else if (err === "fixture_type_id tidak sesuai ketentuan") res.status(400).json({ message: "Fixture_type_id tidak sesuai ketentuan" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async findAll(req, res) {
    try {
      let allRetailer = await tbl_visits.findAll({
        order: [
          ['visit_date', 'ASC'],
        ],
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
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }, {
          model: tbl_stores,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }]
        }],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      res.status(200).json({ message: "Success", total_data: allRetailer.length, data: allRetailer })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }

  static async findOne(req, res) {
    try {
      let allRetailer = await tbl_visits.findByPk(req.params.id, {
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
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }, {
          model: tbl_stores,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }]
        }],
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
      let dataWillProcess = await tbl_visits.findByPk(req.params.id)

      let dataStore = await tbl_stores.findByPk(req.body.store_code)
      let isTrueFixtureType = false

      if (Number(dataStore.retailer_id) === 1 &&
        Number(req.body.fixture_type_id_1) !== 3 && Number(req.body.fixture_type_id_1) !== 6 &&
        Number(req.body.fixture_type_id_2) !== 3 && Number(req.body.fixture_type_id_2) !== 6) {
        isTrueFixtureType = true
      } else if (Number(dataStore.retailer_id) === 2 &&
        Number(req.body.fixture_type_id_1) === 3 &&
        Number(req.body.fixture_type_id_2) === 3) {
        isTrueFixtureType = true
      } else if (Number(dataStore.retailer_id) === 3 &&
        Number(req.body.fixture_type_id_1) === 6 &&
        Number(req.body.fixture_type_id_2) === 6) {
        isTrueFixtureType = true
      }

      if (isTrueFixtureType) {
        let newFixture = {
          fixture_type_id_1: req.body.fixture_type_id_1,
          fixture_type_id_2: req.body.fixture_type_id_2
        }
        await tbl_visit_fixtures.update(newFixture, { where: { id: dataWillProcess.visit_fixture_id } })

        let newData = {
          img_store: req.files[0] ? req.files[0].path : "",
          img_fixture_in: req.files[1] ? req.files[1].path : "",
          img_fixture_out: req.files[2] ? req.files[2].path : "",
          visit_date: new Date(req.body.visit_date),
          user_id: req.user_id,
          store_code: req.body.store_code,
          entry_fixture_comp: req.body.entry_fixture_comp,
          entry_peg_comp: req.body.entry_peg_comp,
          entry_pog_comp: req.body.entry_pog_comp,
          entry_pop_pic_1: req.body.entry_pop_pic_1,
          exit_pop_pic_2: req.body.exit_pop_pic_2,
          entry_google50k: req.body.entry_google50k,
          entry_google100k: req.body.entry_google100k,
          entry_google150k: req.body.entry_google150k,
          entry_google300k: req.body.entry_google300k,
          entry_google500k: req.body.entry_google500k,
          entry_spotify1M: req.body.entry_spotify1M,
          entry_spotify3M: req.body.entry_spotify3M,
          exit_fixture_comp: req.body.exit_fixture_comp,
          exit_peg_comp: req.body.exit_peg_comp,
          exit_pog_comp: req.body.exit_pog_comp,
          entry_pop_pic_2: req.body.entry_pop_pic_2,
          exit_pop_pic_1: req.body.exit_pop_pic_1,
          exit_google50k: req.body.exit_google50k,
          exit_google100k: req.body.exit_google100k,
          exit_google150k: req.body.exit_google150k,
          exit_google300k: req.body.exit_google300k,
          exit_google500k: req.body.exit_google500k,
          exit_spotify1M: req.body.exit_spotify1M,
          exit_spotify3M: req.body.exit_spotify3M,
          assistants_name: req.body.assistants_name,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          entry_remaining_google50k: req.body.entry_remaining_google50k,
          entry_remaining_google100k: req.body.entry_remaining_google100k,
          entry_remaining_google150k: req.body.entry_remaining_google150k,
          entry_remaining_google300k: req.body.entry_remaining_google300k,
          entry_remaining_google500k: req.body.entry_remaining_google500k,
          entry_remaining_spotify1m: req.body.entry_remaining_spotify1m,
          entry_remaining_spotify3m: req.body.entry_remaining_spotify3m,
          exit_remaining_google50k: req.body.exit_remaining_google50k,
          exit_remaining_google100k: req.body.exit_remaining_google100k,
          exit_remaining_google150k: req.body.exit_remaining_google150k,
          exit_remaining_google300k: req.body.exit_remaining_google300k,
          exit_remaining_google500k: req.body.exit_remaining_google500k,
          exit_remaining_spotify1m: req.body.exit_remaining_spotify1m,
          exit_remaining_spotify3m: req.body.exit_remaining_spotify3m
        }
        await tbl_visits.update(newData, { where: { visit_id: req.params.id } })

        let dataReturn = await tbl_visits.findByPk(req.params.id, {
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
            attributes: {
              exclude: ['password', 'createdAt', 'updatedAt']
            }
          }, {
            model: tbl_stores,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            include: [{
              model: tbl_dcs,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              }
            }, {
              model: tbl_retailers,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            }]
          }],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        })

        if (dataReturn) res.status(200).json({ message: "Success", data: dataReturn })
        else throw "bad request"
      } else {
        throw "fixture_type_id tidak sesuai ketentuan"
      }
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else if (err === "fixture_type_id tidak sesuai ketentuan") res.status(400).json({ message: "Fixture_type_id tidak sesuai ketentuan" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async delete(req, res) {
    try {
      let deleteRetailer = await tbl_visits.destroy({ where: { id_visit: req.params.id } })

      if (deleteRetailer) res.status(200).json({ message: "Success", id_deleted: req.params.id })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = visit