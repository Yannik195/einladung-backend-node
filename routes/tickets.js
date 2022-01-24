const Ticket = require("../model/Ticket")
const router = require("express").Router()
const auth = require("./verifyToken")

//check in / check out
router.put("/checkin/:ticketId", auth, async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.ticketId })
        ticket.checkedIn = req.body.checkedIn

        //funktion für aus/einchecken
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