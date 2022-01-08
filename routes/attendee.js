const Attendee = require("../model/Attendee")
const router = require("express").Router()


router.get("/:attendeeId", async (req, res) => {
    console.log("Get attendee")
    console.log(req.params.attendeeId)
    try {
        const attendee = await Attendee.findOne({ _id: req.params.attendeeId })
        console.log(attendee)
        res.send(attendee)
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router