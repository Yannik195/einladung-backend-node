const router = require("express").Router()
const auth = require("./verifyToken")

router.get("/", auth, (req, res) => {
    res.json({ posts: { title: "my first post" }, user: req.user })
})

module.exports = router