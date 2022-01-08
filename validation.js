const Joi = require("joi")

// Validate Register
const validateRegister = body => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(body)
}

// Validate Login
const validateLogin = body => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(body)
}


module.exports.validateRegister = validateRegister
module.exports.validateLogin = validateLogin
