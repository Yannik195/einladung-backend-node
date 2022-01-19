const Organizer = require("../../../model/Organizer")

exports.handleAccountUpdate = async (session) => {
    if (session.details_submitted) {
        const organizerId = session.metadata.organizerId
        await Organizer.updateOne({ _id: organizerId }, { connectedAccountId: session.id, details_submitted: true })
    }
}