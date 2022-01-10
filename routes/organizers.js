const Organizer = require("../model/Organizer")
const router = require("express").Router()
const auth = require("./verifyToken")


//Get one organizer, by jwt id
router.get("/", auth, async (req, res) => {
    test.testFunction()
    try {
        const organizer = await Organizer.findOne({ _id: req.user.userId })
        res.send({
            _id: organizer._id,
            email: organizer.email,
            connectedAccountId: organizer.connectedAccountId,
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
        connectedAccountId: req.body.connectedAccountId,
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

//Update Organizer
router.put("/:organizerId", async (req, res) => {

})


module.exports = router