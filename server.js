const express = require("express")
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()
require('dotenv').config()
const mongoose = require("mongoose")


//CORS
app.use(cors({
    origin: [
        'http://localhost:8080',
        'https://localhost:8080',
        'http://einladung.app',
        'http://www.einladung.app',
        'http://*.einladung.app',
        'https://einladung.app',
        'https://www.einladung.app',
        'https://*.einladung.app',
        /\.einladung\.app$/,
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

//connect to db
mongoose.connect(process.env.DB_CONNECT,
    () => console.log("Connected to MongoDB"))

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
    console.log(req.originalUrl)
    if (req.originalUrl === "/api/stripe/webhook/") {
        console.log(req.originalUrl)
        next();
    } else {
        bodyParser.json()(req, res, next);
    }
});

//Import routes
const authRoutes = require("./routes/auth")
const stripeRoutes = require("./routes/stripe/stripe")
const stripeDashboard = require("./routes/stripe/dashboard")
const stripeWebhook = require("./routes/stripe/webhook/webhook")
const eventRoutes = require("./routes/events")
const organizerRoutes = require("./routes/organizers")
const mailchimpRoutes = require("./routes/mailchimp")
const tickets = require("./routes/tickets")
const attendee = require("./routes/attendee")

//Route Middlewares
app.use("/api/auth", authRoutes)
app.use("/api/stripe", stripeRoutes.router)
app.use("/api/stripe/dashboard", stripeDashboard)
app.use("/api/stripe/webhook", stripeWebhook)
app.use("/api/events", eventRoutes)
app.use("/api/organizers", organizerRoutes)
app.use("/api/mailchimp", mailchimpRoutes)
app.use("/api/tickets", tickets)
app.use("/api/attendee", attendee)

app.listen(3000, () => console.log("Server running"))