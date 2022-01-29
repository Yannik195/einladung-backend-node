const Attendee = require("../../../model/Attendee")
const Ticket = require("../../../model/Ticket")
const Event = require("../../../model/Event")
const Organizer = require("../../../model/Organizer")
const { sendTicket } = require("../../../service/ticket/ticket")

exports.handleCompletedCheckoutSession = async (session) => {
    try {
        //get organizer
        const organizer = await Organizer.findOne({ _id: session.metadata.organizerId })
        //save attendee
        const attendee = new Attendee({
            email: session.customer_details.email,
            firstname: session.metadata.firstname,
            lastname: session.metadata.lastname,
            stripeCustomerId: session.customer,
        })
        const savedAttendee = await attendee.save()

        //??? create ticket
        const ticket = new Ticket()
        let code = ticket.id.substring(ticket.id.length - 4)
        code = code.toUpperCase()
        ticket.code = code
        const savedTicket = await ticket.save()

        //add ticket to attendee
        savedAttendee.ticket = ticket._id
        savedAttendee.save()

        //save attendee to event
        const event = await Event.findOneAndUpdate({ _id: session.metadata.eventId }, { $push: { attendees: [savedAttendee._id] } })

        sendTicket(event, savedAttendee, savedTicket, organizer)
    } catch (err) {
        console.log(err)
    }
}