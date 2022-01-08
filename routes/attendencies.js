const Attendencie = require("../model/Attendencie")
const router = require("express").Router()
const auth = require("./verifyToken")

//Get all attendencies from specified event
router.get("/:eventId", async (req, res) => {
    try {
        const attendencies = await Attendencie.find({ eventId: req.params.eventId })
        res.send(attendencies)
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router