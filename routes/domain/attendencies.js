const Attendencie = require("../../model/Attendencie")
const router = require("express").Router()
const auth = require("../auth/verifyToken")

//Get all attendencies from specified event
router.get("/:eventId", async (req, res) => {
    try {
        const attendencies = await Attendencie.find({ eventId: req.params.eventId })
        res.send(attendencies)
    } catch (err) {
        res.status(400).send(err)
    }
})

//check in
router.put("/checkin/:attendencieId", auth, async (req, res) => {
    console.log("Checkin: " + req.params.attendencieId)
    console.log(req.body)
    try {
        const attendencie = await Attendencie.findOne({ _id: req.params.attendencieId })
        attendencie.checkedIn = req.body.checkedIn
        attendencie.checkedInTime = Date.now()
        await attendencie.save()
        res.send(attendencie)
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router