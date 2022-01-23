
module.exports = function auth(req, res, next) {
    console.log("Verify Token")
    console.log(req.session)
    if (!req.session) return res.status(401).send("Access denied")
    next()
}
