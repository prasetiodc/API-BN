const { tbl_uploads, tbl_category_uploads, tbl_retailers, tbl_notifications, tbl_users, tbl_dcs, tbl_fixture_types, tbl_stores } = require('../models')
const excelToJson = require('convert-excel-to-json');

class upload {
  static async create(req, res) {
    try {
      let POP_promotion_1, POP_promotion_2

      if (req.files.length != 0) {
        POP_promotion_1 = req.files.find(el => el.originalname === 'promotion_1' || el.originalname === 'promotion_1.jpg' || el.originalname === 'promotion_1.png')
        POP_promotion_2 = req.files.find(el => el.originalname === 'promotion_2' || el.originalname === 'promotion_2.jpg' || el.originalname === 'promotion_2.png')
      }

      if (Number(req.body.category_upload_id) === 3) { //UPLOAD POP IDN
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

      if (Number(req.body.category_upload_id) === 1 || Number(req.body.category_upload_id) === 2 || Number(req.body.category_upload_id) === 3) {
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
      } else if (Number(req.body.category_upload_id) === 4) {
        importStore(req.files[0].path, res)
      }

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

async function importStore(pathFile, res) {
  // try {
  const data = excelToJson({
    sourceFile: `${pathFile}`,
    sheets: [{
      name: 'Sheet1',
      header: {
        rows: 1
      },
      columnToKey: {
        A: "no",
        B: "retailer",
        C: "store_code",
        D: "store_name",
        E: "fixture_type_1",
        F: "fixture_type_2",
        G: "dc",
        H: "sub_district",
        I: "district",
        J: "city",
        K: "address",
        L: "md"
      }
    }]
  })


  let allMD = await tbl_users.findAll()
  let allRetailer = await tbl_retailers.findAll()
  let allDC = await tbl_dcs.findAll()
  let allFixtureType = await tbl_fixture_types.findAll()

  console.log(data.Sheet1)
  await data.Sheet1.forEach(async element => {
    let md = await allMD.find(el => el.nik.toLowerCase() === element.md.toLowerCase())
    let fixture_type_1 = await allFixtureType.find(el => el.fixture_type.toLowerCase() === element.fixture_type_1.toLowerCase())
    let fixture_type_2 = await allFixtureType.find(el => el.fixture_type.toLowerCase() === element.fixture_type_2.toLowerCase())
    let retailer = await allRetailer.find(el => el.initial.toLowerCase() === element.retailer.toLowerCase())
    var dc = await allDC.find(el => el.DC_name.toLowerCase() === element.dc.toLowerCase())

    if (!dc) {
      dc = await tbl_dcs.create({ DC_name: element.dc })
    }

    let newObj = {
      store_code: element.store_code,
      store_name: element.store_name,
      md_id: md.id,
      retailer_id: retailer.id,
      dc_id: dc.id,
      fixture_type_id_1: fixture_type_1.id,
      address: element.address,
      sub_district: element.sub_district,
      district: element.district,
      city: element.city
    }
    if (element.fixture_type_2 !== "-") newObj.fixture_type_id_1 = fixture_type_2.id
console.log(newObj)
    await tbl_stores.upsert(newObj)
  })

}

module.exports = upload