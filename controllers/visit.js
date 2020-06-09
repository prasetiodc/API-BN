const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types } = require('../models')
const Op = require('sequelize').Op
var Jimp = require('jimp');
const fs = require('fs')

class visit {
  static async create(req, res) {
    let hasVisited = await checkHasVisited(req.body.store_code, req.body.visit_date)

    try {
      if (hasVisited) {
        res.status(200).json({ message: "Store has visited" })

        req.files && req.files.forEach(el => {
          fs.unlinkSync(`./${el.path}`)
        })
      } else {
        let img_store, img_fixture_in, img_fixture_out
        console.log("start progress add visit", new Date())
        if (req.body.store_name || req.body.dc_id || req.body.city || req.body.address) {
          let newDataStore = {
            store_name: req.body.store_name,
            dc_id: req.body.dc_id,
            city: req.body.city,
            address: req.body.address
          }
          await tbl_stores.update(newDataStore, { where: { store_code: req.body.store_code } })
        }

        if (req.files && req.files.length != 0) {
          img_store = req.files.find(el => el.originalname === 'img_store' || el.originalname === 'img_store.jpg' || el.originalname === 'img_store.png')
          img_fixture_in = req.files.find(el => el.originalname === 'img_fixture_in' || el.originalname === 'img_fixture_in.jpg' || el.originalname === 'img_fixture_in.png')
          img_fixture_out = req.files.find(el => el.originalname === 'img_fixture_out' || el.originalname === 'img_fixture_out.jpg' || el.originalname === 'img_fixture_out.png')
        }

        let newData = {
          img_store: img_store ? img_store.path : ((req.files && req.files[0]) ? req.files[0].path : ""),
          img_fixture_in: img_fixture_in ? img_fixture_in.path : ((req.files && req.files[1]) ? req.files[1].path : ""),
          img_fixture_out: img_fixture_out ? img_fixture_out.path : ((req.files && req.files[2]) ? req.files[2].path : ""),
          visit_date: new Date(req.body.visit_date),
          user_id: req.user_id,
          store_code: req.body.store_code,
          entry_fixture_comp: req.body.entry_fixture_comp,
          entry_correct_fixture: req.body.entry_correct_fixture || null,
          entry_peg_comp: req.body.entry_peg_comp,
          entry_broken_hanger: req.body.entry_broken_hanger || 0,
          entry_pog_comp: req.body.entry_pog_comp,
          entry_correct_pog: req.body.entry_correct_pog,
          entry_pop_pic_1: req.body.entry_pop_pic_1,
          entry_pop_pic_2: req.body.entry_pop_pic_2,
          entry_google50k: req.body.entry_google50k,
          entry_google100k: req.body.entry_google100k,
          entry_google150k: req.body.entry_google150k,
          entry_google300k: req.body.entry_google300k,
          entry_google500k: req.body.entry_google500k,
          entry_spotify1M: req.body.entry_spotify1M === '' ? 0 : req.body.entry_spotify1M,
          entry_spotify3M: req.body.entry_spotify3M === '' ? 0 : req.body.entry_spotify3M,
          exit_fixture_comp: req.body.exit_fixture_comp,
          exit_correct_fixture: req.body.exit_correct_fixture || null,
          exit_peg_comp: req.body.exit_peg_comp,
          exit_broken_hanger: req.body.exit_broken_hanger || 0,
          exit_pog_comp: req.body.exit_pog_comp,
          exit_correct_pog: req.body.exit_correct_pog,
          exit_pop_pic_1: req.body.exit_pop_pic_1,
          exit_pop_pic_2: req.body.exit_pop_pic_2,
          exit_google50k: req.body.exit_google50k,
          exit_google100k: req.body.exit_google100k,
          exit_google150k: req.body.exit_google150k,
          exit_google300k: req.body.exit_google300k,
          exit_google500k: req.body.exit_google500k,
          exit_spotify1M: req.body.exit_spotify1M === '' ? 0 : req.body.exit_spotify1M,
          exit_spotify3M: req.body.exit_spotify3M === '' ? 0 : req.body.exit_spotify3M,
          assistants_name: req.body.assistants_name,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4
        }
        let createVisit = await tbl_visits.create(newData)

        let dataReturn = await tbl_visits.findOne({
          where: { id_visit: createVisit.null },
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
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
        console.log("end progress add visit", new Date())
        
        res.status(201).json({ message: "Success", data: dataReturn })

        req.files && req.files.forEach(el => {
          if (el.mimetype === 'image/jpeg' || el.mimetype === 'image/png') {
            Jimp.read(`./${el.path}`, (err, lenna) => {
              if (err) throw err;
              lenna
                .scaleToFit(500, 500)
                .quality(70)
                .write(`./${el.path}`);
            });
          }
        })
      }
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async findAll(req, res) {
    try {
      let allVisit = await tbl_visits.findAll({
        order: [
          ['visit_date', 'DESC'],
        ],
        include: [{
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
        }],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      if (req.query.page) {
        if (req.query.page === 1) allVisit = allVisit.slice(0, 10)
        else allVisit = allVisit.slice(((req.query.page - 1) * 10), (req.query.page * 10))
      }

      res.status(200).json({ message: "Success", total_data: allVisit.length, data: allVisit })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }

  static async findOne(req, res) {
    try {
      let allVisit = await tbl_visits.findByPk(req.params.id, {
        include: [{
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
        }],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      if (allVisit) res.status(200).json({ message: "Success", data: allVisit })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async update(req, res) {
    try {
      req.files.forEach(el => {
        if (el.mimetype === 'image/jpeg' || el.mimetype === 'image/png') {
          Jimp.read(`./${el.path}`, (err, lenna) => {
            if (err) throw err;
            lenna
              .scaleToFit(500, 500)
              .quality(70)
              .write(`./${el.path}`);
          });
        }
      })

      if (req.files.length != 0) {
        img_store = req.files.find(el => el.originalname === 'img_store' || el.originalname === 'img_store.jpg' || el.originalname === 'img_store.png')
        img_fixture_in = req.files.find(el => el.originalname === 'img_fixture_in' || el.originalname === 'img_fixture_in.jpg' || el.originalname === 'img_fixture_in.png')
        img_fixture_out = req.files.find(el => el.originalname === 'img_fixture_out' || el.originalname === 'img_fixture_out.jpg' || el.originalname === 'img_fixture_out.png')
      }

      let newData = {
        img_store: img_store ? img_store.path : (req.files[0] ? req.files[0].path : ""),
        img_fixture_in: img_fixture_in ? img_fixture_in.path : (req.files[1] ? req.files[1].path : ""),
        img_fixture_out: img_fixture_out ? img_fixture_out.path : (req.files[2] ? req.files[2].path : ""),
        visit_date: new Date(req.body.visit_date),
        user_id: req.user_id,
        store_code: req.body.store_code,
        entry_fixture_comp: req.body.entry_fixture_comp,
        entry_correct_fixture: req.body.entry_correct_fixture,
        entry_peg_comp: req.body.entry_peg_comp,
        entry_broken_hanger: req.body.entry_broken_hanger,
        entry_pog_comp: req.body.entry_pog_comp,
        entry_correct_pog: req.body.entry_correct_pog,
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
        exit_correct_fixture: req.body.exit_correct_fixture,
        exit_peg_comp: req.body.exit_peg_comp,
        exit_broken_hanger: req.body.exit_broken_hanger,
        exit_pog_comp: req.body.exit_pog_comp,
        exit_correct_pog: req.body.exit_correct_pog,
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
        q4: req.body.q4
      }
      await tbl_visits.update(newData, { where: { visit_id: req.params.id } })

      let dataReturn = await tbl_visits.findByPk(req.params.id, {
        include: [{
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
        }],
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


async function checkHasVisited(storeCode, dateVisit) {
  let month = new Date(dateVisit).getMonth()
  let year = new Date(dateVisit).getFullYear()

  let checkStore = await tbl_visits.findOne({
    where: {
      store_code: storeCode,
      visit_date: {
        [Op.gte]: new Date(year, month, 1, 0, 0, 0),
        [Op.lt]: new Date(year, month + 1, 1, 0, 0, 0),
      }
    }
  })

  if (checkStore) return true
  else return false
}

module.exports = visit
