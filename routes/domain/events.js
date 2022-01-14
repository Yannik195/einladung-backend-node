const Event = require("../../model/Event")
const router = require("express").Router()
const auth = require("../auth/verifyToken")


//Get all events of specific organizer (specified in jwt)
router.get("/", auth, async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.user.userId })
        res.send(events)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Get one event by subdomain
router.get("/subdomain/:subdomain", async (req, res) => {
    console.log("Get event by subdomain")
    try {
        const event = await Event.findOne({ subdomain: req.params.subdomain })
        res.send(event)
    } catch (err) {
        res.status(400).send(err)
    }
})

//get one event by id
router.get("/eventId/:eventId", auth, async (req, res) => {
    console.log("Get eventby id")
    try {
        const event = await Event.findOne({ _id: req.params.eventId })
        res.send(event)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Create new event
router.post("/", auth, async (req, res) => {
    console.log("create event")
    console.log(req.body)
    console.log(req.body.subdomain)

    //Check if subdomain already exists
    try {
        const subdomainExists = await Event.findOne({ subdomain: req.body.subdomain })
        if (subdomainExists) res.status(400).send("Subdomain already exists")
    } catch (err) {
        console.log(err)
    }

    const event = new Event({
        title: req.body.title,
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

//Check if subdomain is unique
//used in "create event"

router.get("/subdomainIsUnique", auth, async (req, res) => {
    console.log("subdomain")
    const event = await Event.findOne({ subdomain: req.body.subdomain })
    if (!event) {
        res.send("true")
    } else {
        res.send("false")
    }
})




module.exports = router