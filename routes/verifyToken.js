const jwt = require("jsonwebtoken")

module.exports = function auth(req, res, next) {
    const token = getAuthToken(req)

    if (!token) return res.status(401).send("Access denied")

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        console.log(verified)
        next()
    } catch (err) {
        res.status(400).send("Invalid Token")
    }
}

const getAuthToken = function (req) {
    const value = `; ${req.header("Cookie")}`;
    const parts = value.split(`; auth-token=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}
