const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        condition: Joi.string().required(),      
        carType: Joi.string().required(),      
        registrationType: Joi.string().required(),      
        registrationDate: Joi.string().required(),      
        brandModel: Joi.string().required(),      
        mileage: Joi.number().required(),      
        year: Joi.number().required(),      
        seat: Joi.number().required(),      
        color: Joi.string().required(),      
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().allow("", null),
    }).required()
})