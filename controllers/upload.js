const { tbl_uploads, tbl_category_uploads, tbl_retailers, tbl_notifications, tbl_users } = require('../models')

class upload {
  static async create(req, res) {
    try {
      let newData = {
        path: req.file.path,
        category_upload_id: req.body.category_upload_id,
        retailer_id: req.body.retailer_id
      }
      let createUpload = await tbl_uploads.create(newData)

      let dataReturn = await tbl_uploads.findOne({
        where: { id: createUpload.id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          require: true,
          model: tbl_category_uploads,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }]
      })

      res.status(201).json({ message: "Success", data: dataReturn })

      let allUser = await tbl_users.findAll()
console.log(allUser)
      allUser.forEach(async el => {
        let newData = {
          message: `Ada file ${req.body.category_upload_id} baru`,
          path_file: req.file.path,
          user_id: el.id,
          read: 0
        }
        await tbl_notifications.create(newData)
      })
      req.user_id

    } catch (err) {
      console.log(err)
      if (err === "bad request") res.status(400).json({ message: "Bad request" })
      else res.status(500).json({ message: "Error", err })
    }
  }

  static async findAll(req, res) {
    try {
      let allFileUpload = await tbl_uploads.findAll({
        order: [
          ['id', 'DESC'],
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          require: true,
          model: tbl_category_uploads,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }, {
          model: tbl_retailers,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }]
      })

      let allCategori = await tbl_category_uploads.findAll({})

      let datas = []
      await allCategori.forEach(async element => {
        let file = await allFileUpload.find(el => el.category_upload_id === element.id)

        let newObj = {
          id: element.id,
          category: element.category,
          path: file ? file.path : null,
          retailer: file ? file.tbl_retailer : null
        }
        datas.push(newObj)
      });


      res.status(200).json({ message: "Success", data: datas })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }

}

module.exports = upload