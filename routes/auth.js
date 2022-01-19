const jwt = require("jsonwebtoken")
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

    const token = jwt.sign({
        userId: organizer._id,
        details_submitted: organizer.details_submitted,
    }, process.env.TOKEN_SECRET)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Origin', 'https://einladung.app');

    res.cookie("auth-token", token, { maxAge: 48 * 60 * 60 * 1000, domain: "einladung.app", httpOnly: false }).send()
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
            details_submitted: organizer.details_submitted,
        }, process.env.TOKEN_SECRET)
        res.cookie("auth-token", token, { maxAge: 48 * 60 * 60 * 1000 }).send()
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get("/cookie", (req, res) => {
    res.cookie("cookie name", "cookie")
    res.send()
})

module.exports = router
