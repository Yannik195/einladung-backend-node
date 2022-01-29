const Organizer = require("../model/Organizer")
const Event = require("../model/Event")
const router = require("express").Router()
const auth = require("./verifyToken")
const { sendTicket } = require("../service/ticket/ticket")


//Get all events of specific organizer (specified in jwt)
router.get("/", auth, async (req, res) => {
    console.log("Get events")
    try {
        const organizer = await Organizer.findOne({ _id: req.session.organizerId })
            .populate({
                path: "events",
                populate: {
                    path: "attendees"
                }
            })
        res.send(organizer.events)
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
            _id: event._id,
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
        price: convertPrice(req.body.price),
    })

    try {
        const savedEvent = await event.save()
        await Organizer.findOneAndUpdate({ _id: req.session.organizerId }, { $push: { events: [savedEvent._id] } })
        res.status(201).send(savedEvent)
    } catch (err) {
        res.status(400).send(err)
    }
})

//substract credit card cost here?
const convertPrice = (price) => {
    //If price has 
    if (price.includes(",")) {
        const priceArray = price.split(",")
        //If price has one decimal, add a zero at the end and concat
        if (priceArray[1].length == 1)
            return `${priceArray[0]}${priceArray[1]}0`
        //if price has 2 just concat
        else if (priceArray[1].length == 2)
            return `${priceArray[0]}${priceArray[1]}`
        //if price hast more, send bad request
        else if (priceArray[1].length > 2)
            res.status(400).send("Bad Price Format")

    } else if (price.includes(".")) {
        const priceArray = price.split(".")
        if (priceArray[1].length == 1)
            return `${priceArray[0]}${priceArray[1]}0`
        else if (priceArray[1].length == 2)
            return `${priceArray[0]}${priceArray[1]}`
        else if (priceArray[1].length > 2)
            res.status(400).send("Bad Price Format")
    } else {
        //if price has no decimal (eg 10) multiply *100 = 1000
        return price * 100
    }
}

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

router.post("/send-demo-ticket", async (req, res) => {
    const event = {
        title: "Demo Event",
        price: "1000",
        subdomain: "demo",
        date: "1.1.2022",
        time: "20:00",
        address: {
            street: "Musterstraße",
            number: "10",
            city: "Stuttgart",
            zip: "70123",
        },
    }

    const attendee = {
        firstname: "Max",
        lastname: "Mustermann",
        email: req.body.email,
    }

    const ticket = {
        id: "123456789",
        boughtAt: Date.now(),
        code: "6789"
    }

    const organizer = {
        firstname: "Unternehmen oder",
        lastname: "Name",
    }

    await sendTicket(event, attendee, ticket, organizer)

})

module.exports = router