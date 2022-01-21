const Organizer = require("../model/Organizer")
const router = require("express").Router()
const auth = require("./verifyToken")


//Get one organizer, by jwt id
router.get("/", auth, async (req, res) => {
    try {
        const organizer = await Organizer.findOne({ _id: req.session.organizerId })
        res.send({
            _id: organizer._id,
            email: organizer.email,
            connectedId: organizer.connectedId,
            details_submitted: organizer.details_submitted,
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get("/:organizerId", auth, async (req, res) => {
    try {
        const organizer = await Event.findOne({ organizerId: req.params.organizerId })
        res.send(organizer)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Add Organizer
router.post("/", async (req, res) => {
    const organizer = new Organizer({
        name: req.body.name,
        email: req.body.email,
        connectedId: req.body.connectedId,
        address: {
            street: req.body.address.street,
            number: req.body.address.number,
            city: req.body.address.city,
            zip: req.body.address.zip,
        },
    })

    try {
        const savedOrganizer = await organizer.save()
        res.send(savedOrganizer)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router