const Organizer = require("../model/Organizer")
const router = require("express").Router()
const auth = require("./verifyToken")


//Get one organizer, by jwt id
router.get("/", auth, async (req, res) => {
    try {
        const organizer = await Organizer.findOne({ _id: req.session.organizerId })
        res.send({
            _id: organizer._id,
            firstname: organizer.firstname,
            lastname: organizer.lastname,
            email: organizer.email,
            company: organizer.company,
            address: organizer.address
        })
    } catch (err) {
        res.status(400).send(err)
    }
})


//Get one organizer by id
// unauth
//used for event page
router.get("/id/:organizerId", async (req, res) => {
    try {
        const organizer = await Event.findOne({ organizerId: req.params.organizerId })
        //Organizer DTO
        organizerDTO = {
            _id: organizer._id,
            firstname: organizer.firstname,
            lastname: organizer.lastname,
            email: organizer.email,
            company: organizer.company,
            address: organizer.address
        }
        res.send(organizerDTO)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Add Organizer
router.post("/", async (req, res) => {
    const organizer = new Organizer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        company: req.body.company,
    })

    try {
        await organizer.save()
        res.status(204).send()
    } catch (err) {
        res.status(400).send(err)
    }
})

//Check if organizer hast connected account id
router.get("/has-connected", auth, async (req, res) => {
    console.log("check for connected id")
    try {
        const organizer = await Organizer.findOne({ _id: req.session.organizerId })
        if (organizer.connectedId == "false") {
            console.log("organizer has NO connected ID")
            res.status(403).send()
        } else {
            console.log("organizer has connected ID")
            res.status(204).send()
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router