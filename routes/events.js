const Event = require("../model/Event")
const router = require("express").Router()
const auth = require("./verifyToken")


//Get all events of specific organizer (specified in jwt)
router.get("/", auth, async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.user.userId })
        res.send(events)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Get one event
router.get("/:subdomain", async (req, res) => {
    console.log("Get event")
    try {
        const event = await Event.findOne({ subdomain: req.params.subdomain })
        res.send(event)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Create new event
router.post("/", auth, async (req, res) => {
    console.log("create event")
    const event = new Event({
        name: req.body.name,
        subdomain: req.body.subdomain,
        description: req.body.description,
        time: req.body.time,
        date: req.body.date,
        address: {
            street: req.body.address.street,
            number: req.body.address.number,
            city: req.body.address.city,
            zip: req.body.address.zip,
        },
        price: req.body.price,
        organizerId: req.user.userId,
    })

    try {
        const savedEvent = await event.save()
        res.send(savedEvent)
    } catch (err) {
        res.status(400).send(err)
    }
})




module.exports = router