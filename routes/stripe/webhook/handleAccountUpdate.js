const Organizer = require("../../../model/Organizer")


exports.handleAccountUpdate = async (session) => {
    console.log(JSON.stringify(session));
    console.log(session)

    if (session.details_submitted) {
        console.log("user has succesfully finished onboarding")
        console.log(JSON.stringify(session));

        const organizerId = session.metadata.organizerId
        await Organizer.updateOne({ _id: organizerId }, { connectedAccountId: session.id, details_submitted: true })
    }

}