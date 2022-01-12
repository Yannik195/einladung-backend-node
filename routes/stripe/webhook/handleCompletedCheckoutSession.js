const Attendee = require("../../../model/Attendee")
const Attendencie = require("../../../model/Attendencie")
const Event = require("../../../model/Event")
const { sendTicket } = require("../../../service/ticket/ticket")

exports.handleCompletedCheckoutSession = async (session) => {
    const event = await Event.findOne({ _id: session.metadata.eventId })

    const attendee = new Attendee({
        email: session.customer_details.email,
        firstname: session.metadata.firstname,
        lastname: session.metadata.lastname,
        stripeCustomerId: session.customer,
    })

    try {
        const savedAttendee = await attendee.save()
        console.log(savedAttendee)

        const attendencie = new Attendencie({
            eventId: session.metadata.eventId,
            attendeeId: savedAttendee.id,
        })
        try {
            const savedAttendencie = await attendencie.save()
            console.log(savedAttendencie)

            sendTicket()
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}