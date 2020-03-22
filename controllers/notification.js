const { tbl_notifications } = require('../models')

class notification {
  static async findAll(req, res) {
    try {
      let allNotification = await tbl_notifications.findAll({
        where: { user_id: req.user_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })

      res.status(200).json({ message: "Success", total_data: allNotification.length, data: allNotification })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error", err })
    }
  }

  static async update(req, res) {
    try {
      await tbl_notifications.update({ read: 1 }, { where: { id: req.params.id } })

      let dataReturn = await tbl_notifications.findByPk(req.params.id, {
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
}

module.exports = notification