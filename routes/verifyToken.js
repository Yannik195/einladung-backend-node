
module.exports = function auth(req, res, next) {
    if (!req.session.organizerId) return res.status(401).send("Access denied")
    next()
}
