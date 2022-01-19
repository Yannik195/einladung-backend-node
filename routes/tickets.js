const Ticket = require("../model/Ticket")
const Organizer = require("../model/Organizer")
const router = require("express").Router()
const auth = require("./verifyToken")

//Get all tickets from specified event
router.get("/eventId/:eventId", async (req, res) => {
    try {
        const tickets = await Ticket.find({ eventId: req.params.eventId })
            .populate("attendee")
            .populate("event")
        res.send(tickets)
    } catch (err) {
        res.status(400).send(err)
    }
})

//check in / check out
router.put("/checkin/:ticketId", auth, async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.ticketId })
        ticket.checkedIn = req.body.checkedIn
        if (req.body.checkIn) {
            ticket.checkedInTime = Date.now()
        } else {
            ticket.checkedInTime = null
        }
        await ticket.save()
        res.send(ticket)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router