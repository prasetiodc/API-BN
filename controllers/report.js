const { tbl_visits, tbl_stores, tbl_users, tbl_retailers, tbl_dcs, tbl_fixture_types } = require('../models')
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
        }]
      })

      let dataReturn = []
      if (allRetailer) {
        await allRetailer.forEach(visit => {
          let newObj = {
            Retailer: visit.tbl_store.tbl_retailer.initial,
            "Store Name": `${visit.tbl_store.tbl_retailer.retailer_name} - ${visit.tbl_store.store_name} (${visit.tbl_store.store_code})`,
            "Store Code": visit.tbl_store.store_code,
            "BHN Store#": '',
            "DC": visit.tbl_store.tbl_dc.DC_name,
            "Date of Visit": visit.visit_date,
            Address: visit.tbl_store.address,
            "District": visit.tbl_store.district,
            "City": visit.tbl_store.city,
            "Does the staff know how to activate Gift cards?": Number(visit.q1) === 1 ? "Yes" : "No",
            "Does the staff know how to activate POR?": Number(visit.q2) === 1 ? "Yes" : "No",
            "Does the staff know how to handle customer complaints about Gift card redemption?": Number(visit.q3) === 1 ? "Yes" : "No",
            "50K Facings": visit.tbl_store.fixtureType1.google_50k,
            "100K Facings": visit.tbl_store.fixtureType1.google_100k,
            "150K Facings": visit.tbl_store.fixtureType1.google_150k,
            "300K Facings": visit.tbl_store.fixtureType1.google_300k,
            "500K Facings": visit.tbl_store.fixtureType1.google_500k,
            "Fixture type (Entry)": Number(visit.entry_fixture_comp) === 1
              ? visit.tbl_store.fixtureType1.id === 2 || visit.tbl_store.fixtureType1.id === 3
                ? "Vertical Inline"
                : visit.tbl_store.fixtureType1.id === 7 || visit.tbl_store.fixtureType1.id === 8 || visit.tbl_store.fixtureType1.id === 9
                  ? "-"
                  : visit.tbl_store.fixtureType1.fixture_type
              : visit.entry_correct_fixture_id.id === 2 || visit.entry_correct_fixture_id.id === 3
                ? "Vertical Inline"
                : visit.entry_correct_fixture_id.id === 7 || visit.entry_correct_fixture_id.id === 8 || visit.entry_correct_fixture_id.id === 9
                  ? "-"
                  : visit.entry_correct_fixture_id.fixture_type,
            "Broken Pegs (Entry)": visit.entry_broken_hanger ? visit.entry_broken_hanger : 0,
            "Is the planogram displayed correctly (Entry)": Number(visit.entry_pog_comp) === 1 ? "Yes" : "No",
            "Reason if Not (Entry)": Number(visit.entry_pog_comp) === 1
              ? ""
              : visit.entry_correct_pog === "Gantungan rusak / patah"
                ? "Broken Pegs"
                : visit.entry_correct_pog === "Voucher tidak sesuai aturan"
                  ? "Messy"
                  : visit.entry_correct_pog === "Stock voucher kosong"
                    ? "Not enough stock"
                    : "",
            "50K Facings (Entry)": visit.entryGoogle50KSpacing,
            "100K Facings (Entry)": visit.entryGoogle100KSpacing,
            "150K Facings (Entry)": visit.entryGoogle150KSpacing,
            "300K Facings (Entry)": visit.entryGoogle300KSpacing,
            "500K Facings (Entry)": visit.entryGoogle500KSpacing,
            "Google 50K (Entry)": Number(visit.entry_google50k) >= 15 ? "Over 15" : visit.entry_google50k,
            "Google 100K (Entry)": Number(visit.entry_google100k) >= 15 ? "Over 15" : visit.entry_google100k,
            "Google 150K (Entry)": Number(visit.entry_google150k) >= 10 ? "Over 10" : visit.entry_google150k,
            "Google 300K (Entry)": Number(visit.entry_google300k) >= 10 ? "Over 10" : visit.entry_google300k,
            "Google 500K (Entry)": Number(visit.entry_google500k) >= 10 ? "Over 10" : visit.entry_google500k,
            "Spotify 1 Month (Entry)": Number(visit.entry_spotify1M) >= 15 ? "Yes" : visit.entry_spotify1M,
            "Spotify 3 Month (Entry)": Number(visit.entry_spotify3M) >= 15 ? "Yes" : visit.entry_spotify3M,
            "POP Pic 1 (Entry)": Number(visit.entry_pop_pic_1) === 1 ? "Yes" : "No",
            "POP Pic 2 (Entry)": Number(visit.entry_pop_pic_2) === 1 ? "Yes" : "No",
            "Fixture type (Exit)": Number(visit.exit_fixture_comp) === 1
              ? visit.tbl_store.fixtureType1.id === 2 || visit.tbl_store.fixtureType1.id === 3
                ? "Vertical Inline"
                : visit.tbl_store.fixtureType1.id === 7 || visit.tbl_store.fixtureType1.id === 8 || visit.tbl_store.fixtureType1.id === 9
                  ? "-"
                  : visit.tbl_store.fixtureType1.fixture_type
              : visit.exit_correct_fixture_id.id === 2 || visit.exit_correct_fixture_id.id === 3
                ? "Vertical Inline"
                : visit.exit_correct_fixture_id.id === 7 || visit.exit_correct_fixture_id.id === 8 || visit.exit_correct_fixture_id.id === 9
                  ? "-"
                  : visit.exit_correct_fixture_id.fixture_type,
            "Broken Pegs (Exit)": visit.exit_broken_hanger ? visit.exit_broken_hanger : 0,
            "Is the planogram displayed correctly (Exit)": Number(visit.exit_pog_comp) === 1 ? "Yes" : "No",
            "Reason if Not (Exit)": Number(visit.exit_pog_comp) === 1
              ? ""
              : visit.exit_correct_pog === "Gantungan rusak / patah"
                ? "Broken Pegs"
                : visit.exit_correct_pog === "Voucher tidak sesuai aturan"
                  ? "Messy"
                  : visit.exit_correct_pog === "Stock voucher kosong"
                    ? "Not enough stock"
                    : "",
            "50K Facings (Exit)": visit.exitGoogle50KSpacing,
            "100K Facings (Exit)": visit.exitGoogle100KSpacing,
            "150K Facings (Exit)": visit.exitGoogle150KSpacing,
            "300K Facings (Exit)": visit.exitGoogle300KSpacing,
            "500K Facings (Exit)": visit.exitGoogle500KSpacing,
            "Google 50K (Exit)": Number(visit.exit_google50k) >= 15 ? "Over 15" : visit.exit_google50k,
            "Google 100K (Exit)": Number(visit.exit_google100k) >= 15 ? "Over 15" : visit.exit_google100k,
            "Google 150K (Exit)": Number(visit.exit_google150k) >= 10 ? "Over 10" : visit.exit_google150k,
            "Google 300K (Exit)": Number(visit.exit_google300k) >= 10 ? "Over 10" : visit.exit_google300k,
            "Google 500K (Exit)": Number(visit.exit_google500k) >= 10 ? "Over 10" : visit.exit_google500k,
            "Spotify 1 Month (Exit)": Number(visit.exit_spotify1M) >= 15 ? "Yes" : visit.exit_spotify1M,
            "Spotify 3 Month (Exit)": Number(visit.exit_spotify3M) >= 15 ? "Yes" : visit.exit_spotify3M,
            "POP Pic 1 (Exit)": Number(visit.exit_pop_pic_1) === 1 ? "Yes" : "No",
            "POP Pic 2 (Exit)": Number(visit.exit_pop_pic_2) === 1 ? "Yes" : "No",



            // NIK: visit.tbl_user.nik,
            // "MD Name": visit.tbl_user.name,
            // "Sub District": visit.tbl_store.sub_district,
            // "Documentation Store": visit.img_store ? `http://212.237.35.40:3030/${visit.img_store}` : '',
            // "Picture (Entry)": visit.img_fixture_in ? `http://212.237.35.40:3030/${visit.img_fixture_in}` : '',
            // "Expected Fixture": visit.tbl_store.fixtureType1.fixture_type,
            // "PEG Compliance (Entry)": Number(visit.entry_peg_comp) === 1 ? "Yes" : "No",
            // "Picture (Exit)": visit.img_fixture_out ? `http://212.237.35.40:3030/${visit.img_fixture_out}` : '',
            // "PEG Compliance (Exit)": Number(visit.exit_peg_comp) === 1 ? "Yes" : "No",
            // "Shop Assistants Name": visit.assistants_name,
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