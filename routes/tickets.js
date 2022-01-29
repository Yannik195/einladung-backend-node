const Ticket = require("../model/Ticket")
const Attendee = require("../model/Attendee")
const router = require("express").Router()
const auth = require("./verifyToken")

//check in / check out
router.put("/checkin/:ticketId", auth, async (req, res) => {
    try {
        //query for attendee to send back his name
        const attendee = await Attendee.findOne({ ticket: req.params.ticketId })
        console.log(attendee)
        const ticket = await Ticket.findOne({ _id: req.params.ticketId })
        ticket.checkedIn = req.body.checkedIn

        //funktion für aus/einchecken
        if (req.body.checkIn) {
            ticket.checkedInTime = Date.now()
        } else {
            ticket.checkedInTime = null
        }
        await ticket.save()
        res.status(201).send(attendee)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router