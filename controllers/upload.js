const { tbl_uploads, tbl_category_uploads, tbl_retailers, tbl_notifications, tbl_users } = require('../models')

class upload {
  static async create(req, res) {
    try {
      let POP_promotion_1, POP_promotion_2

      if (req.files.length != 0) {
        POP_promotion_1 = req.files.find(el => el.originalname === 'promotion_1')
        POP_promotion_2 = req.files.find(el => el.originalname === 'promotion_2')
      }

      if (req.body.category_upload_id === 3) { //UPLOAD POP IDN
        let datasReturn = []

        if (POP_promotion_1) {
          let newData = {
            path: POP_promotion_1,
            category_upload_id: 1,
            retailer_id: req.body.retailer_id,
            information: 'promotion_1'
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
          datasReturn.push(dataReturn)
        }

        if (POP_promotion_2) {
          let newData = {
            path: POP_promotion_2,
            category_upload_id: 1,
            retailer_id: req.body.retailer_id,
            information: 'promotion_2'
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
          datasReturn.push(dataReturn)
        }
        res.status(201).json({ message: "Success", data: datasReturn })

      } else {
        let newData = {
          path: req.files[0].path,
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
      }


      let allUser = await tbl_users.findAll()

      allUser.forEach(async el => {
        if (req.body.category_upload_id === 3) { //UPLOAD POP IDN

          if (POP_promotion_1) {
            let newData = {
              message: `Ada file ${dataReturn.tbl_category_upload.category} baru`,
              path_file: POP_promotion_1,
              user_id: el.id,
              read: 0
            }
            await tbl_notifications.create(newData)
          }
          if (POP_promotion_2) {
            let newData = {
              message: `Ada file ${dataReturn.tbl_category_upload.category} baru`,
              path_file: POP_promotion_2,
              user_id: el.id,
              read: 0
            }
            await tbl_notifications.create(newData)
          }

        } else {
          let newData = {
            message: `Ada file ${dataReturn.tbl_category_upload.category} baru`,
            path_file: req.files[0].path,
            user_id: el.id,
            read: 0
          }
          await tbl_notifications.create(newData)
        }
      })

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

        if (element.id === 3) { //PROMOTION
          for (let i = 1; i <= 3; i++) {
            let file = await allFileUpload.find(el => el.category_upload_id === element.id && el.retailer_id === i)
            
            let newObj = {
              id: element.id,
              category: element.category,
              path: file ? file.path : null,
              retailer: file ? file.tbl_retailer : null
            }
            datas.push(newObj)
          }
          console.log(datas)
        } else {
          let file = await allFileUpload.find(el => el.category_upload_id === element.id)

          let newObj = {
            id: element.id,
            category: element.category,
            path: file ? file.path : null,
            retailer: file ? file.tbl_retailer : null
          }
          datas.push(newObj)
        }
      });


      res.status(200).json({ message: "Success", data: datas })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }

}

module.exports = upload