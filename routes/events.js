const Event = require("../model/Event")
const router = require("express").Router()
const auth = require("./verifyToken")

//Get all events of specific organizer (specified in jwt)
router.get("/", auth, async (req, res) => {
    console.log("Get events")
    try {
        const events = await Event.find({ organizer: req.session.organizerId })
            .populate({
                path: "attendees",
                populate: {
                    path: "ticket"
                }
            })
        res.send(events)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Get one event by subdomain
//used for event.einladung.app
router.get("/subdomain/:subdomain", async (req, res) => {
    console.log("Get event by subdomain")
    try {
        const event = await Event.findOne({ subdomain: req.params.subdomain })

        const eventDTO = {
            title: event.title,
            subdomain: event.subdomain,
            description: event.description,
            time: event.time,
            date: event.date,
            price: event.price,
            address: event.address,
        }

        //Create DTO as we dont want to send back the amount of attendees
        res.send(eventDTO)
    } catch (err) {
        res.status(400).send(err)
    }
})

//get one event by id with attendees and tickets
//used for organizer event overview
router.get("/eventId/:eventId/attendees", auth, async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.eventId })
            .populate({
                path: "attendees",
                populate: {
                    path: "ticket"
                }
            })
        res.send(event)
    } catch (err) {
        res.status(400).send(err)
    }
})

//used for local testing, where there is no subdomain
router.get("/eventId/:eventId", auth, async (req, res) => {
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
        organizer: req.session.organizerId,
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