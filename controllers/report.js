const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types, tbl_visit_fixtures } = require('../models')
const Op = require('sequelize').Op

class report {
  static async findAll(req, res) {
    try {
      let conditionInTblVisit = {}

      if (req.query.daily) {
        conditionInTblVisit.visit_date = {
          [Op.and]: {
            [Op.gt]: new Date(`${new Date(req.query.daily).getFullYear()}-${new Date(req.query.daily).getMonth() + 1}-${new Date(req.query.daily).getDate()}`),
            [Op.lt]: new Date(`${new Date(req.query.daily).getFullYear()}-${new Date(req.query.daily).getMonth() + 1}-${new Date(req.query.daily).getDate() + 1}`)
          }
        }
      } else if (req.query.weekly) {
        let dateMonday = new Date(req.query.weekly).getDate() - (new Date(req.query.weekly).getDay() - 1)
        let dateSunday = dateMonday + 6
        conditionInTblVisit.visit_date = {
          [Op.and]: {
            [Op.gte]: new Date(new Date(req.query.weekly).getFullYear(), new Date(req.query.weekly).getMonth(), dateMonday),
            [Op.lte]: new Date(new Date(req.query.weekly).getFullYear(), new Date(req.query.weekly).getMonth(), dateSunday + 1)
          }
        }
      } else if (req.query.monthly) {
        conditionInTblVisit.visit_date = {
          [Op.and]: {
            [Op.gte]: new Date(`${new Date(req.query.monthly).getFullYear()}-${new Date(req.query.monthly).getMonth() + 1}-01`),
            [Op.lte]: new Date(`${new Date(req.query.monthly).getFullYear()}-${new Date(req.query.monthly).getMonth() + 2}-01`)
          }
        }
      }

      let allRetailer = await tbl_visits.findAll({
        where: conditionInTblVisit,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
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
          required: true,
          model: tbl_users,
          attributes: ['id', 'nik', 'name']
        }, {
          required: true,
          model: tbl_stores,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [{
            required: true,
            model: tbl_dcs,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }, {
            required: true,
            model: tbl_retailers,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          }]
        }]
      })

      let dataReturn = []
      if (allRetailer) {
        await allRetailer.forEach(visit => {
          let newObj = {
            "Visit Date": visit.visit_date,
            NIK: visit.tbl_user.nik,
            "MD Name": visit.tbl_user.name,
            Retail: visit.tbl_store.tbl_retailer.retailer_name,
            "Store Name": `${visit.tbl_store.tbl_retailer.retailer_name} - ${visit.tbl_store.store_name} (${visit.tbl_store.store_code})`,
            "Store Code": visit.tbl_store.store_code,
            "DC": visit.tbl_store.tbl_dc.DC_name,
            Address: visit.tbl_store.address,
            "Sub District": visit.tbl_store.sub_district,
            "District": visit.tbl_store.district,
            "City": visit.tbl_store.city,
            "Documentation Store": visit.img_store,
            "Picture (Entry)": visit.img_fixture_in,
            "Fixture Compliance (Entry)": Number(visit.entry_fixture_comp) === 1 ? "Yes" : "No",
            "PEG Compliance (Entry)": Number(visit.entry_peg_comp) === 1 ? "Yes" : "No",
            "POG Compliance (Entry)": Number(visit.entry_pog_comp) === 1 ? "Yes" : "No",
            "Google 50k (Entry)": Number(visit.entry_google50k) === 1 ? "Yes" : "No",
            "Google 100k (Entry)": Number(visit.entry_google100k) === 1 ? "Yes" : "No",
            "Google 150k (Entry)": Number(visit.entry_google150k) === 1 ? "Yes" : "No",
            "Google 300k (Entry)": Number(visit.entry_google300k) === 1 ? "Yes" : "No",
            "Google 500k (Entry)": Number(visit.entry_google500k) === 1 ? "Yes" : "No",
            "Spotify 1 Month (Entry)": Number(visit.entry_spotify1M) === 1 ? "Yes" : "No",
            "Spotify 3 Month (Entry)": Number(visit.entry_spotify3M) === 1 ? "Yes" : "No",
            "POP Pic 1 (Entry)": Number(visit.entry_pop_pic_1) === 1 ? "Yes" : "No",
            "POP Pic 2 (Entry)": Number(visit.entry_pop_pic_2) === 1 ? "Yes" : "No",
            "Picture (Exit)": Number(visit.img_fixture_out) === 1 ? "Yes" : "No",
            "Fixture Compliance (Exit)": Number(visit.exit_fixture_comp) === 1 ? "Yes" : "No",
            "PEG Compliance (Exit)": Number(visit.exit_peg_comp) === 1 ? "Yes" : "No",
            "POG Compliance (Exit)": Number(visit.exit_pog_comp) === 1 ? "Yes" : "No",
            "Google 50k (Exit)": Number(visit.exit_google50k) === 1 ? "Yes" : "No",
            "Google 100k (Exit)": Number(visit.exit_google100k) === 1 ? "Yes" : "No",
            "Google 150k (Exit)": Number(visit.exit_google150k) === 1 ? "Yes" : "No",
            "Google 300k (Exit)": Number(visit.exit_google300k) === 1 ? "Yes" : "No",
            "Google 500k (Exit)": Number(visit.exit_google500k) === 1 ? "Yes" : "No",
            "Spotify 1 Month (Exit)": Number(visit.exit_spotify1M) === 1 ? "Yes" : "No",
            "Spotify 3 Month (Exit)": Number(visit.exit_spotify3M) === 1 ? "Yes" : "No",
            "POP Pic 1 (Exit)": Number(visit.exit_pop_pic_1) === 1 ? "Yes" : "No",
            "POP Pic 2 (Exit)": Number(visit.exit_pop_pic_2) === 1 ? "Yes" : "No",
            "Shop Assistants Name": visit.assistants_name,
            "Does the staff know how to activate Gift cards?": Number(visit.q1) === 1 ? "Yes" : "No",
            "Does the staff know how to activate POR?": Number(visit.q2) === 1 ? "Yes" : "No",
            "Does the staff know how to handle customer complaints about Gift card redemption?": Number(visit.q3) === 1 ? "Yes" : "No",
            "Does the staff know about existing promotions for each gift cards?": Number(visit.q4) === 1 ? "Yes" : "No",
          }
          dataReturn.push(newObj)
        });
      }
      res.status(200).json({ message: "Success", total_data: dataReturn.length, data: dataReturn })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }
}

module.exports = report