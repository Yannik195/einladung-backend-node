const Attendee = require("../../../model/Attendee")
const Ticket = require("../../../model/Ticket")
const Event = require("../../../model/Event")
const Organizer = require("../../../model/Organizer")
const { sendTicket } = require("../../../service/ticket/ticket")

exports.handleCompletedCheckoutSession = async (session) => {
    const event = await Event.findOne({ _id: session.metadata.eventId })
    const organizer = await Organizer.findOne({ _id: session.metadata.organizerId })
    const attendee = new Attendee({
        email: session.customer_details.email,
        firstname: session.metadata.firstname,
        lastname: session.metadata.lastname,
        stripeCustomerId: session.customer,
    })

    try {
        const savedAttendee = await attendee.save()
        console.log(savedAttendee)

        const ticket = new Ticket({
            eventId: session.metadata.eventId,
            attendee: savedAttendee._id,
        })
        try {
            const savedTicket = await ticket.save()
            console.log(savedTicket)

            sendTicket(event, savedAttendee, savedTicket, organizer)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}