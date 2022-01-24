const Attendee = require("../../../model/Attendee")
const Ticket = require("../../../model/Ticket")
const Event = require("../../../model/Event")
const Organizer = require("../../../model/Organizer")
const { sendTicket } = require("../../../service/ticket/ticket")

exports.handleCompletedCheckoutSession = async (session) => {
    const organizer = await Organizer.findOne({ _id: session.metadata.organizerId })
    const attendee = new Attendee({
        email: session.customer_details.email,
        firstname: session.metadata.firstname,
        lastname: session.metadata.lastname,
        stripeCustomerId: session.customer,
    })

    try {
        const savedAttendee = await attendee.save()

        const ticket = new Ticket({
            event: session.metadata.eventId,
            attendee: savedAttendee._id,
        })
        savedAttendee.ticket = ticket._id
        savedAttendee.save()
        const event = await Event.findOneAndUpdate({ _id: session.metadata.eventId }, { $push: { attendees: [savedAttendee._id] } })

        try {
            const savedTicket = await ticket.save()

            //TODO welche objekte brauche ich etc
            //kann ich die abfragen schlanger gestalten?
            //mit populates?
            sendTicket(event, savedAttendee, savedTicket, organizer)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}