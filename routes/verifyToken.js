const jwt = require("jsonwebtoken")

module.exports = function auth(req, res, next) {
    const token = req.header("auth-token")
    console.log(req.body)
    console.log("Verify token " + token)

    if (!token) return res.status(401).send("Access denied")

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        res.cookie("auth-token2", token)
        next()
    } catch (err) {
        console.log("invalid token")
        res.status(400).send("Invalid Token")
    }
}
