const { tbl_uploads, tbl_category_uploads, tbl_retailers, tbl_notifications, tbl_users, tbl_dcs, tbl_fixture_types, tbl_stores } = require('../models')
const excelToJson = require('convert-excel-to-json');

class upload {
  static async create(req, res) {
    try {
      let POP_promotion_1, POP_promotion_2, dataReturn

      if (Number(req.body.category_upload_id) === 3) {
        POP_promotion_1 = req.files.find(el => el.originalname === 'promotion_1' || el.originalname === 'promotion_1.jpg' || el.originalname === 'promotion_1.png') || req.files[0]
        POP_promotion_2 = req.files.find(el => el.originalname === 'promotion_2' || el.originalname === 'promotion_2.jpg' || el.originalname === 'promotion_2.png') || req.files[1]
      }

      if (Number(req.body.category_upload_id) === 1 || Number(req.body.category_upload_id) === 2) { //UPLOAD POG AND FIXTURE TRAIT

        let newData = {
          path: POP_promotion_1.path,
          category_upload_id: 1,
          retailer_id: req.body.retailer_id,
        }
        let createUpload = await tbl_uploads.create(newData)

        if (Number(req.body.category_upload_id) === 1) {
          await tbl_fixture_types.update({ POG: req.files[0].path }, { where: { id: req.body.fixture_type_id } })

        } else if (Number(req.body.category_upload_id) === 2) {
          await tbl_fixture_types.update({ fixture_traits: req.files[0].path }, { where: { id: req.body.fixture_type_id } })
        }

        dataReturn = await tbl_uploads.findOne({
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

      } else if (Number(req.body.category_upload_id) === 3) { //UPLOAD POP IDN
        let datasReturn = []
        if (POP_promotion_1) {
          let newData = {
            path: POP_promotion_1.path,
            category_upload_id: 1,
            retailer_id: req.body.retailer_id,
            information: 'promotion_1'
          }
          let createUpload = await tbl_uploads.create(newData)

          dataReturn = await tbl_uploads.findOne({
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

          await tbl_retailers.update({ promotion_1: POP_promotion_1.path }, { where: { id: req.body.retailer_id } })
          datasReturn.push(dataReturn)
        }

        if (POP_promotion_2) {
          let newData = {
            path: POP_promotion_2.path,
            category_upload_id: 1,
            retailer_id: req.body.retailer_id,
            information: 'promotion_2'
          }
          let createUpload = await tbl_uploads.create(newData)

          let dataReturns = await tbl_uploads.findOne({
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
          await tbl_retailers.update({ promotion_2: POP_promotion_2.path }, { where: { id: req.body.retailer_id } })

          datasReturn.push(dataReturns)
        }
        console.log(datasReturn)
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


      // SEND NOTIF OR IMPORT STORE
      if (Number(req.body.category_upload_id) === 1 || Number(req.body.category_upload_id) === 2 || Number(req.body.category_upload_id) === 3) {
        let allUser = await tbl_users.findAll()

        allUser.forEach(async el => {
          if (Number(req.body.category_upload_id) === 3) { //UPLOAD POP IDN
            if (POP_promotion_1) {
              let newData = {
                message: `Ada file ${dataReturn.tbl_category_upload.category} baru`,
                path_file: POP_promotion_1.path,
                user_id: el.id,
                read: 0
              }
              await tbl_notifications.create(newData)
            }
            if (POP_promotion_2) {
              let newData = {
                message: `Ada file ${dataReturn.tbl_category_upload.category} baru`,
                path_file: POP_promotion_2.path,
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

      let allCategori = await tbl_category_uploads.findAll()
      let allRetailer = await tbl_retailers.findAll()

      let datas = []
      await allCategori.forEach(async element => {

        if (Number(element.id) === 1 || Number(element.id) === 2 || Number(element.id) === 3) { //PROMOTION
          let newObj = {
            id: element.id,
            category: element.category,
          }
          let data = []

          await allRetailer.forEach(async retailer => {
            let file = await allFileUpload.find(el => el.category_upload_id === element.id && el.retailer_id === retailer.id)

            let tempObj = {
              retailer_id: retailer.id,
              retailer_name: retailer.retailer_name,
              initial: retailer.initial,
            }

            if (Number(element.id) === 3 && Number(retailer.id) === 1) {
              let file1 = allFileUpload.find(el =>
                (el.category_upload_id === element.id && el.retailer_id === retailer.id && el.information === 'promotion_1') ||
                (el.category_upload_id === element.id && el.retailer_id === retailer.id))
              let file2 = allFileUpload.find(el =>
                (el.category_upload_id === element.id && el.retailer_id === retailer.id && el.information === 'promotion_2' && el.id !== file1.id) ||
                (el.category_upload_id === element.id && el.retailer_id === retailer.id && el.id !== file1.id))

              tempObj.path_1 = file1 ? file1.path : null
              tempObj.path_2 = file2 ? file2.path : null

            } else {
              tempObj.path = file ? file.path : null
            }

            data.push(tempObj)
          })
          newObj.retailers = data
          datas.push(newObj)
        } else {
          let file = await allFileUpload.find(el => el.category_upload_id === element.id)

          let newObj = {
            id: element.id,
            category: element.category,
            path: file ? file.path : null,
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