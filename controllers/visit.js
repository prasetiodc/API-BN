const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types } = require('../models')
const Op = require('sequelize').Op
var Jimp = require('jimp');
const fs = require('fs')
const { createDateAsUTC } = require('../helpers/convertDate');
const excelToJson = require('convert-excel-to-json');

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
          visit_date: createDateAsUTC(new Date(req.body.visit_date)),
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
          q4: req.body.q4,
          entryGoogle50KSpacing: req.body.entryGoogle50KSpacing,
          entryGoogle100KSpacing: req.body.entryGoogle100KSpacing,
          entryGoogle150KSpacing: req.body.entryGoogle150KSpacing,
          entryGoogle300KSpacing: req.body.entryGoogle300KSpacing,
          entryGoogle500KSpacing: req.body.entryGoogle500KSpacing,
          exitGoogle50KSpacing: req.body.exitGoogle50KSpacing,
          exitGoogle100KSpacing: req.body.exitGoogle100KSpacing,
          exitGoogle150KSpacing: req.body.exitGoogle150KSpacing,
          exitGoogle300KSpacing: req.body.exitGoogle300KSpacing,
          exitGoogle500KSpacing: req.body.exitGoogle500KSpacing,
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
        visit_date: createDateAsUTC(new Date(req.body.visit_date)),
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
        q4: req.body.q4,
        entryGoogle50KSpacing: req.body.entryGoogle50KSpacing,
        entryGoogle100KSpacing: req.body.entryGoogle100KSpacing,
        entryGoogle150KSpacing: req.body.entryGoogle150KSpacing,
        entryGoogle300KSpacing: req.body.entryGoogle300KSpacing,
        entryGoogle500KSpacing: req.body.entryGoogle500KSpacing,
        exitGoogle50KSpacing: req.body.exitGoogle50KSpacing,
        exitGoogle100KSpacing: req.body.exitGoogle100KSpacing,
        exitGoogle150KSpacing: req.body.exitGoogle150KSpacing,
        exitGoogle300KSpacing: req.body.exitGoogle300KSpacing,
        exitGoogle500KSpacing: req.body.exitGoogle500KSpacing,
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

  static async import(req, res) {
    try {
      console.log("MASUK")
      let result = excelToJson({
        sourceFile: req.file.path,
        header: {
          rows: 2
        },
        columnToKey: {
          A: 'retailer',
          B: 'storeName',
          C: 'storeCode',
          D: 'bhnStore',
          E: 'dc',
          F: 'dateOfVisit',
          G: 'address',
          H: 'district',
          I: 'city',
          J: 'activeGift',
          K: 'activePOR',
          L: 'redemption',
          M: '50kFacings',
          N: '100kFacings',
          O: '150kFacings',
          P: '300kFacings',
          Q: '500kFacings',
          R: 'entryFixtureType',
          S: 'entryBrokenPegs',
          T: 'entryPOG',
          U: 'entryCorrectPOG',
          V: 'entry50kFacing',
          W: 'entry100kFacing',
          X: 'entry150kFacing',
          Y: 'entry300kFacing',
          Z: 'entry500kFacing',
          AA: 'entryGoogle50k',
          AB: 'entryGoogle100k',
          AC: 'entryGoogle150k',
          AD: 'entryGoogle300k',
          AE: 'entryGoogle500k',
          AF: 'entrySpotify1m',
          AG: 'entrySpotify3m',
          AH: 'entryPOPPic1',
          AI: 'entryPOPPic2',
          AJ: 'exitFixtureType',
          AK: 'exitBrokenPegs',
          AL: 'exitPOG',
          AM: 'exitCorrectPOG',
          AN: 'exit50kFacing',
          AO: 'exit100kFacing',
          AP: 'exit150kFacing',
          AQ: 'exit300kFacing',
          AR: 'exit500kFacing',
          AS: 'exitGoogle50k',
          AT: 'exitGoogle100k',
          AU: 'exitGoogle150k',
          AV: 'exitGoogle300k',
          AW: 'exitGoogle500k',
          AX: 'exitSpotify1m',
          AY: 'exitSpotify3m',
          AZ: 'exitPOPPic1',
          BA: 'exitPOPPic2',
          BB: 'md'
        }
      })
      res.status(200).json({ message: "Success" })

      let visited = await tbl_visits.findAll({ limit: 1, offset: 1 })
      let allMD = await tbl_users.findAll()
      let allFixtureType = await tbl_fixture_types.findAll()
      let allStore = await tbl_stores.findAll()
      let sheet

      for (let key in result) {
        sheet = result[key]
      }

      console.log("LENGTH OF DATA", sheet.length)
      console.log("START IMPORT VISIT", createDateAsUTC(new Date()))
      for (let i = 0; i < sheet.length; i++) {
        let storeSelected = await allStore.find(store => store.store_code === sheet[i].storeCode)
        let entryFixComp, entryCorrectPOG, exitFixComp, exitCorrectPOG

        if (sheet[i].entryFixtureType === "Vertical Inline") {
          if (storeSelected.fixture_type_id_1 === 2 || storeSelected.fixture_type_id_1 === 3) { //DEFAULT VERTICAL INLINE
            entryFixComp = 1
            entryCorrectPOG = null
          } else { //BUKAN DEFAULT VERTICAL INLINE
            if (storeSelected.retailer_id === 1) { //IDM
              entryFixComp = 0
              entryCorrectPOG = 2
            } else {
              entryFixComp = 0
              entryCorrectPOG = 3
            }
          }
        } else {
          let checkFixtureType = await allFixtureType.find(fixType => fixType.fixture_type.toLowerCase() === sheet[i].entryFixtureType.toLowerCase())

          if (storeSelected.fixture_type_id_1 === checkFixtureType.id) {
            entryFixComp = 1
            entryCorrectPOG = null
          } else {
            entryFixComp = 0
            entryCorrectPOG = checkFixtureType.id
          }
        }

        if (sheet[i].exitFixtureType === "Vertical Inline") {
          if (storeSelected.fixture_type_id_1 === 2 || storeSelected.fixture_type_id_1 === 3) { //DEFAULT VERTICAL INLINE
            exitFixComp = 1
            exitCorrectPOG = null
          } else { //BUKAN DEFAULT VERTICAL INLINE
            if (storeSelected.retailer_id === 1) { //IDM
              exitFixComp = 0
              exitCorrectPOG = 2
            } else {
              exitFixComp = 0
              exitCorrectPOG = 3
            }
          }
        } else {
          let checkFixtureType = await allFixtureType.find(fixType => fixType.fixture_type.toLowerCase() === sheet[i].exitFixtureType.toLowerCase())

          if (storeSelected.fixture_type_id_1 === checkFixtureType.id) {
            exitFixComp = 1
            exitCorrectPOG = null
          } else {
            exitFixComp = 0
            exitCorrectPOG = checkFixtureType.id
          }
        }

        let newData = {
          img_store: visited[0].img_store,
          img_fixture_in: visited[0].img_fixture_in,
          img_fixture_out: visited[0].img_fixture_out,
          visit_date: sheet[i].dateOfVisit,
          user_id: allMD.find(md => md.nik === sheet[i].md || md.name === sheet[i].md).id,
          store_code: sheet[i].storeCode,
          entry_fixture_comp: entryFixComp,
          entry_correct_fixture: entryCorrectPOG,
          entry_peg_comp: sheet[i].entryBrokenPegs === 0 ? 1 : 0,
          entry_broken_hanger: sheet[i].entryBrokenPegs === 0 ? null : sheet[i].entryBrokenPegs,
          entry_pog_comp: sheet[i].entryCorrectPOG ? 0 : 1,
          entry_correct_pog: sheet[i].entryCorrectPOG || null,
          entry_pop_pic_1: sheet[i].entryPOPPic1 === "Yes" ? 1 : 0,
          entry_pop_pic_2: sheet[i].entryPOPPic2 === "Yes" ? 1 : 0,
          entry_google50k: sheet[i].entryGoogle50k === "Over 15" ? 15 : sheet[i].entryGoogle50k,
          entry_google100k: sheet[i].entryGoogle100k === "Over 15" ? 15 : sheet[i].entryGoogle100k,
          entry_google150k: sheet[i].entryGoogle150k === "Over 10" ? 10 : sheet[i].entryGoogle150k,
          entry_google300k: sheet[i].entryGoogle300k === "Over 10" ? 10 : sheet[i].entryGoogle300k,
          entry_google500k: sheet[i].entryGoogle500k === "Over 10" ? 10 : sheet[i].entryGoogle500k,
          entry_spotify1M: sheet[i].entrySpotify1m === "Yes" ? 15 : sheet[i].entrySpotify1m,
          entry_spotify3M: sheet[i].entrySpotify3m === "Yes" ? 15 : sheet[i].entrySpotify3m,
          exit_fixture_comp: exitFixComp,
          exit_correct_fixture: exitCorrectPOG,
          exit_peg_comp: sheet[i].exitBrokenPegs === 0 ? 1 : 0,
          exit_broken_hanger: sheet[i].exitBrokenPegs === 0 ? null : sheet[i].exitBrokenPegs,
          exit_pog_comp: sheet[i].exitCorrectPOG ? 0 : 1,
          exit_correct_pog: sheet[i].exitCorrectPOG || null,
          exit_pop_pic_1: sheet[i].exitPOPPic1 === "Yes" ? 1 : 0,
          exit_pop_pic_2: sheet[i].exitPOPPic2 === "Yes" ? 1 : 0,
          exit_google50k: sheet[i].exitGoogle50k === "Over 15" ? 15 : sheet[i].exitGoogle50k,
          exit_google100k: sheet[i].exitGoogle100k === "Over 15" ? 15 : sheet[i].exitGoogle100k,
          exit_google150k: sheet[i].exitGoogle150k === "Over 10" ? 10 : sheet[i].exitGoogle150k,
          exit_google300k: sheet[i].exitGoogle300k === "Over 10" ? 10 : sheet[i].exitGoogle300k,
          exit_google500k: sheet[i].exitGoogle500k === "Over 10" ? 10 : sheet[i].exitGoogle500k,
          exit_spotify1M: sheet[i].exitSpotify1m === "Yes" ? 15 : sheet[i].exitSpotify1m,
          exit_spotify3M: sheet[i].exitSpotify3m === "Yes" ? 15 : sheet[i].exitSpotify3m,
          q1: sheet[i].activeGift === "Yes" ? 1 : 0,
          q2: sheet[i].activePOR === "Yes" ? 1 : 0,
          q3: sheet[i].redemption === "Yes" ? 1 : 0,
          entryGoogle50KSpacing: sheet[i].entry50kFacing,
          entryGoogle100KSpacing: sheet[i].entry100kFacing,
          entryGoogle150KSpacing: sheet[i].entry150kFacing,
          entryGoogle300KSpacing: sheet[i].entry300kFacing,
          entryGoogle500KSpacing: sheet[i].entry500kFacing,
          exitGoogle50KSpacing: sheet[i].exit50kFacing,
          exitGoogle100KSpacing: sheet[i].exit100kFacing,
          exitGoogle150KSpacing: sheet[i].exit150kFacing,
          exitGoogle300KSpacing: sheet[i].exit300kFacing,
          exitGoogle500KSpacing: sheet[i].exit500kFacing,
        }

        await tbl_visits.create(newData)
          .then(response => { })
          .catch(err => { })
      }
      console.log("FINISH IMPORT VISIT", createDateAsUTC(new Date()))

    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
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
