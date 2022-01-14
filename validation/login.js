const Joi = require("joi")

// Validate Login
const validateLogin = body => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(body)
}

module.exports.validateLogin = validateLogin
