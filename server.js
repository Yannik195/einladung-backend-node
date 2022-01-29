const express = require("express")
const bodyParser = require("body-parser");
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
var session = require('express-session');
const MongoStore = require("connect-mongo")

const app = express()

app.use(session({
    secret: 'yoursecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECT,
    }),
    cookie: {
        maxAge: 1000 * 60 * 24,
        httpOnly: false,
    }
}));

//CORS
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:8081',
        'https://einladung.app',
        'https://www.einladung.app',
        'https://*.einladung.app',
        /\.einladung\.app$/,
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin: http://localhost:8080");
    res.header("Access-Control-Allow-Credentials: true");
    res.header("Access-Control-Allow-Methods: GET, POST");
    res.header("Access-Control-Allow-Headers: Content-Type, *");
    next();
});

//connect to db
mongoose.connect(process.env.DB_CONNECT,
    () => console.log("Connected to MongoDB"))

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
    console.log(req.originalUrl)
    if (req.originalUrl.startsWith("/api/stripe/webhook")) {
        next();
    } else {
        bodyParser.json()(req, res, next);
    }
});


//Import routes
const authRoutes = require("./routes/auth")
const stripeRoutes = require("./routes/stripe/stripe")
const stripeDashboard = require("./routes/stripe/dashboard")
const stripeWebhookDirect = require("./routes/stripe/webhook/direct")
const stripeWebhookConnect = require("./routes/stripe/webhook/connect")
const eventRoutes = require("./routes/events")
const organizerRoutes = require("./routes/organizers")
const mailchimpRoutes = require("./routes/mailchimp")
const tickets = require("./routes/tickets")
const attendee = require("./routes/attendee")

//Route Middlewares
app.use("/api/auth", authRoutes)
app.use("/api/stripe", stripeRoutes.router)
app.use("/api/stripe/dashboard", stripeDashboard)
app.use("/api/stripe/webhook/direct", stripeWebhookDirect)
app.use("/api/stripe/webhook/connect", stripeWebhookConnect)
app.use("/api/events", eventRoutes)
app.use("/api/organizers", organizerRoutes)
app.use("/api/mailchimp", mailchimpRoutes)
app.use("/api/tickets", tickets)
app.use("/api/attendee", attendee)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))