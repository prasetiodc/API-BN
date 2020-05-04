const { tbl_stores, tbl_retailers, tbl_dcs, tbl_users, tbl_fixture_types, tbl_visits } = require('../models')
const Op = require('sequelize').Op

class store {
  static async create(req, res) {
    try {
      let isTrueFixtureType = false

      if (Number(req.body.retailer_id) === 1 &&
        Number(req.body.fixture_type_id_1) !== 3 && Number(req.body.fixture_type_id_1) !== 6 &&
        Number(req.body.fixture_type_id_2) !== 3 && Number(req.body.fixture_type_id_2) !== 6) {
        isTrueFixtureType = true
      } else if (Number(req.body.retailer_id) === 2 &&
        Number(req.body.fixture_type_id_1) === 3 &&
        Number(req.body.fixture_type_id_2) === 3) {
        isTrueFixtureType = true
      } else if (Number(req.body.retailer_id) === 3 &&
        Number(req.body.fixture_type_id_1) === 6 &&
        Number(req.body.fixture_type_id_2) === 6) {
        isTrueFixtureType = true
      }

      if (isTrueFixtureType) {
        let newData = {
          store_code: req.body.store_code,
          store_name: req.body.store_name,
          md_id: req.body.md_id,
          retailer_id: req.body.retailer_id,
          dc_id: req.body.dc_id,
          fixture_type_id_1: req.body.fixture_type_id,
          fixture_type_id_2: req.body.fixture_type_id,
          address: req.body.address,
          sub_district: req.body.sub_district,
          district: req.body.district,
          city: req.body.city
        }
        let createStore = await tbl_stores.create(newData)

        createStore && await updateTotalStoreInRetailer(req.body.retailer_id, "add")

        let dataReturn = await tbl_stores.findOne({
          where: { store_code: req.body.store_code },
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
            model: tbl_users,
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
          }, {
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
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
      let allStore
      if (req.query.forVisit === 'true') {
        let tempStore = []
        let monthNow = new Date().getMonth() + 1
        let monthNext = new Date().getMonth() + 2

        if (monthNow < 10) monthNow = `0${monthNow}`
        if (monthNext < 10) monthNext = `0${monthNext}`

        let dataVisit = await tbl_visits.findAll({
          where: {
            user_id: req.user_id,
            [Op.and]: [
              { visit_date: { [Op.gte]: `${new Date().getFullYear()}-${monthNow}-01` } },
              { visit_date: { [Op.lt]: `${new Date().getFullYear()}-${monthNext}-01` } }
            ]
          }
        })


        allStore = await tbl_stores.findAll({
          where: { md_id: req.user_id },
          include: [{
            model: tbl_users,
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
          }, {
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        })

        await allStore.forEach(async store => {
          let cekAvailable = await dataVisit.find(el => store.store_code === el.store_code)

          if (!cekAvailable) tempStore.push(store)
        });

        allStore = tempStore

      } else {
        allStore = await tbl_stores.findAll({
          include: [{
            model: tbl_users,
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
          }, {
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        })
      }
      
      res.status(200).json({ message: "Success", total_data: allStore.length, data: allStore })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }

  static async findOne(req, res) {
    try {
      let store = await tbl_stores.findByPk(req.params.id, {
        include: [{
          model: tbl_users,
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
        }, {
          model: tbl_dcs,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        }, {
          model: tbl_retailers,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      if (store) res.status(200).json({ message: "Success", data: store })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async update(req, res) {
    try {
      let oldData = await tbl_stores.findByPk(req.params.id)

      if (Number(req.body.retailer_id) === 1 &&
        Number(req.body.fixture_type_id_1) !== 3 && Number(req.body.fixture_type_id_1) !== 6 &&
        Number(req.body.fixture_type_id_2) !== 3 && Number(req.body.fixture_type_id_2) !== 6) {
        isTrueFixtureType = true
      } else if (Number(req.body.retailer_id) === 2 &&
        Number(req.body.fixture_type_id_1) === 3 &&
        Number(req.body.fixture_type_id_2) === 3) {
        isTrueFixtureType = true
      } else if (Number(req.body.retailer_id) === 3 &&
        Number(req.body.fixture_type_id_1) === 6 &&
        Number(req.body.fixture_type_id_2) === 6) {
        isTrueFixtureType = true
      }

      if (isTrueFixtureType) {

        let newData = {
          store_code: req.body.store_code,
          store_name: req.body.store_name,
          md_id: req.body.md_id,
          retailer_id: req.body.retailer_id,
          dc_id: req.body.dc_id,
          fixture_type_id_1: req.body.fixture_type_id,
          fixture_type_id_2: req.body.fixture_type_id,
          address: req.body.address,
          sub_district: req.body.sub_district,
          district: req.body.district,
          city: req.body.city
        }

        await tbl_stores.update(newData, { where: { store_code: req.params.id } })

        if (oldData.retailer_id !== newData.retailer_id) {
          await updateTotalStoreInRetailer(oldData.retailer_id, "delete")
          await updateTotalStoreInRetailer(newData.retailer_id, "add")
        }

        let dataReturn = await tbl_stores.findByPk(req.params.id, {
          include: [{
            model: tbl_users,
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
          }, {
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
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
      let oldData = await tbl_stores.findByPk(req.params.id)
      let deleteStore = await tbl_stores.destroy({ where: { store_code: req.params.id } })

      updateTotalStoreInRetailer(oldData.retailer_id, "delete")

      if (deleteStore) res.status(200).json({ message: "Success", id_deleted: req.params.id })
      else throw "bad request"
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }
}

async function updateTotalStoreInRetailer(idRetailer, args) {
  let retailerSelected = await tbl_retailers.findByPk(idRetailer)

  if (args === "add") {
    await tbl_retailers.update({ total_store: Number(retailerSelected.total_store) + 1 }, { where: { id: idRetailer } })
  } else if (args === "delete") {
    await tbl_retailers.update({ total_store: Number(retailerSelected.total_store) - 1 }, { where: { id: idRetailer } })
  }
}

module.exports = store