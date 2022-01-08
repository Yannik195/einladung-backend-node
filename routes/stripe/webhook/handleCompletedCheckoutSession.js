const Attendee = require("../../../model/Attendee")
const Attendencie = require("../../../model/Attendencie")

exports.handleCompletedCheckoutSession = async (session) => {
    console.log(`User ${session.customer_details.email} succesfully payed for the event`)
    console.log(JSON.stringify(session));

    const attendee = new Attendee({
        email: session.customer_details.email,
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
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}