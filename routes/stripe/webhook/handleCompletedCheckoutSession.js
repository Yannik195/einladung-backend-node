const Attendee = require("../../../model/Attendee")
const Attendencie = require("../../../model/Attendencie")
const Event = require("../../../model/Event")
const sendTicketViaMail = require("../../mail/mail")

exports.handleCompletedCheckoutSession = async (session) => {
    console.log(`User ${session.customer_details.email} succesfully payed for the event`)
    console.log(JSON.stringify(session));

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
            //TODO send mail with qr code to attendee
            //email
            //event details
            //qr code
            //refund link?
            //query for event

            try {
                sendTicketViaMail.sendMail(attendee, savedAttendencie, event)
            } catch (err) {
                console.log(err)
            }

            console.log(savedAttendencie)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}