const { tbl_stores, tbl_retailers, tbl_dcs, tbl_users } = require('../models')

class store {
  static async create(req, res) {
    try {
      let newData = {
        store_code: req.body.store_code,
        store_name: req.body.store_name,
        md_id: req.body.md_id,
        retailer_id: req.body.retailer_id,
        dc_id: req.body.dc_id,
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
        },{
          model: tbl_dcs,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },{
          model: tbl_retailers,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        }]
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
      let allStore = await tbl_stores.findAll({
        include: [{
          model: tbl_users,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },{
          model: tbl_dcs,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },{
          model: tbl_retailers,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      res.status(200).json({ message: "Success", total_data: allStore.length, data: allStore })
    } catch (err) {
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
        },{
          model: tbl_dcs,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },{
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

      let newData = {
        store_code: req.body.store_code,
        store_name: req.body.store_name,
        md_id: req.body.md_id,
        retailer_id: req.body.retailer_id,
        dc_id: req.body.dc_id,
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
        },{
          model: tbl_dcs,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },{
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
    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
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