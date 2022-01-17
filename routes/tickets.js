const Ticket = require("../model/Ticket")
const router = require("express").Router()
const auth = require("./verifyToken")

//Get all tickets from specified event
router.get("/event/:eventId", async (req, res) => {
    try {
        const tickets = await Ticket.find({ eventId: req.params.eventId }).populate("attendee")
        console.log(tickets)
        res.send(tickets)
    } catch (err) {
        res.status(400).send(err)
    }
})

//check in / check out
router.put("/checkin/:attendencieId", auth, async (req, res) => {
    console.log("Checkin: " + req.params.attendencieId)
    console.log(req.body)
    try {
        const ticket = await Ticket.findOne({ _id: req.params.attendencieId })
        ticket.checkedIn = req.body.checkedIn
        if (req.body.checkIn) {
            ticket.checkedInTime = Date.now()
        } else {
            ticket.checkedInTime = null
        }
        await ticket.save()
        res.send(attendencie)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router