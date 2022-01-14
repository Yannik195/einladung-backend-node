const router = require("express").Router()
const jwt = require("jsonwebtoken")
const { validateLogin } = require("../../validation/login")
const Organizer = require("../../model/Organizer")
const bcrypt = require("bcryptjs")

router.post("/", async (req, res) => {
    console.log("login")
    // Validate Register Information
    const { error } = validateLogin(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Checking if the email exists
    const organizer = await Organizer.findOne({ email: req.body.email })
    if (!organizer) return res.status(400).send("Email is not found")

    //Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, organizer.password)
    if (!validPassword) return res.status(400).send("Invalid Password")

    const token = jwt.sign({
        userId: organizer._id,
        details_submitted: organizer.details_submitted,
    }, process.env.TOKEN_SECRET)
    res.header("auth-token", token).send(token)

})

module.exports = router