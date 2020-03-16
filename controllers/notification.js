const { tbl_notifications } = require('../models')

class notification {
  static async findAll(req, res) {
    console.log(req.user_id)
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
}

module.exports = notification