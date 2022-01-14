const jwt = require("jsonwebtoken")
const router = require("express").Router()
const Organizer = require("../../model/Organizer")
const bcrypt = require("bcryptjs")
const { validateRegister } = require("../../validation/register")

router.post("/register", async (req, res) => {
    // Validate Register Information
    const { error } = validateRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Checking if email already exists
    const emailExists = await Organizer.findOne({ email: req.body.email })
    if (emailExists) return res.status(400).send("Email already exists")

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create new User
    const organizer = new Organizer({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        //Save user
        const savedOrganizer = await organizer.save()

        //Send jwt 
        const token = jwt.sign({
            userId: savedOrganizer._id,
        }, process.env.TOKEN_SECRET)
        res.header("auth-token", token).send(token)

    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router