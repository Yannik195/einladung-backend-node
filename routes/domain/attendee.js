const Attendee = require("../../model/Attendee")
const router = require("express").Router()


router.get("/:attendeeId", async (req, res) => {
    console.log("Get attendee")
    try {
        const attendee = await Attendee.findOne({ _id: req.params.attendeeId })
        res.send(attendee)
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router