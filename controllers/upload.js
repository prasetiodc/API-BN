const { tbl_uploads, tbl_category_uploads, tbl_retailers, tbl_notifications, tbl_users, tbl_dcs, tbl_fixture_types, tbl_stores } = require('../models')
const excelToJson = require('convert-excel-to-json');
const Jimp = require('jimp');

class upload {
  static async create(req, res) {
    try {
      let POP_promotion_1, POP_promotion_2, dataReturn

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

      if (Number(req.body.category_upload_id) === 3) {
        POP_promotion_1 = req.files.find(el => el.originalname === 'promotion_1' || el.originalname === 'promotion_1.jpg' || el.originalname === 'promotion_1.png') || req.files[0]
        POP_promotion_2 = req.files.find(el => el.originalname === 'promotion_2' || el.originalname === 'promotion_2.jpg' || el.originalname === 'promotion_2.png') || req.files[1]
      }

      if (Number(req.body.category_upload_id) === 1 || Number(req.body.category_upload_id) === 2) { //UPLOAD POG AND FIXTURE TRAIT

        let newData = {
          path: req.files.path,
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
        await importStore(req.files[0].path, res)
        await refreshTotalStore()
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
      let allFixtureType = await tbl_fixture_types.findAll({
        attributes: ['id', 'fixture_type', 'POG', 'fixture_traits', 'retailer_id'],
      })

      let datas = []
      await allCategori.forEach(async element => {

        if (Number(element.id) === 1 || Number(element.id) === 2 || Number(element.id) === 3) { //PROMOTION
          let newObj = {
            id: element.id,
            category: element.category,
          }
          let data = []

          await allRetailer.forEach(async retailer => {
            let tempObj = {
              retailer_id: retailer.id,
              retailer_name: retailer.retailer_name,
              initial: retailer.initial,
            }

            if (Number(element.id) === 1 || Number(element.id) === 2) {
              let tempFixtureType = await allFixtureType.filter(el => el.retailer_id === retailer.id)
              let data = []
              tempFixtureType.forEach(fixType => {
                delete fixType.fixture_traits
                let obj = {
                  id: fixType.id,
                  fixture_type: fixType.fixture_type
                }
                if (Number(element.id) === 1) obj.POG = fixType.POG
                if (Number(element.id) === 2) obj.fixture_traits = fixType.fixture_traits

                data.push(obj)
              })
              tempObj.file = data
            }else{
              if(retailer.id===1){
                tempObj.promotion_1=retailer.promotion_1
                tempObj.promotion_2=retailer.promotion_2
              }else{
                tempObj.promotion=retailer.promotion_1
              }
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
  var allDC = await tbl_dcs.findAll()
  let allFixtureType = await tbl_fixture_types.findAll()

  await data.Sheet1.forEach(async element => {
    let md = await allMD.find(el => el.nik.toLowerCase() === element.md.toLowerCase())
    let fixture_type_1 = await allFixtureType.find(el => el.fixture_type.toLowerCase() === element.fixture_type_1.toLowerCase())
    let fixture_type_2 = await allFixtureType.find(el => el.fixture_type.toLowerCase() === element.fixture_type_2.toLowerCase())
    let retailer = await allRetailer.find(el => el.initial.toLowerCase() === element.retailer.toLowerCase())
    var dc = await allDC.find(el => el.DC_name.toLowerCase() === element.dc.toLowerCase())

    if (!dc) {
      dc = await tbl_dcs.create({ DC_name: element.dc })
      allDC = await tbl_dcs.findAll()
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

    if (element.fixture_type_2 !== "-" && element.fixture_type_2 !== "") newObj.fixture_type_id_2 = fixture_type_2.id

    await tbl_stores.upsert(newObj)
  })

}

async function refreshTotalStore() {
  let allRetailer = await tbl_retailers.findAll()
  let allStore = await tbl_stores.findAll()

  await allRetailer.forEach(async retailer => {
    let storeRetailer = await allStore.filter(store => Number(store.retailer_id) === Number(retailer.id))

    await tbl_retailers.update({ total_store: storeRetailer.length }, { where: { id: retailer.id } })
  })
}

module.exports = upload