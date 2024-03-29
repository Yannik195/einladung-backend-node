const router = require("express").Router()
const Organizer = require("../model/Organizer")
const bcrypt = require("bcryptjs")
const { validateRegister, validateLogin } = require("../validation")

router.post("/login", async (req, res) => {
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

    req.session.organizerId = organizer._id
    req.session.connectedId = organizer.connectedId
    res.status(200).send()
})

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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        company: req.body.company,
        email: req.body.email,
        password: hashedPassword
    })

    req.session.organizerId = organizer._id
    req.session.connectedId = false

    try {
        //Save user
        await organizer.save()
        res.status(204).send()
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        res.clearCookie("connect.sid");
        res.status(200).send()
    });
})

module.exports = router
