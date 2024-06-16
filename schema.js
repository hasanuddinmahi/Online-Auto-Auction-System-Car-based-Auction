const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        condition: Joi.string().required(),
        carType: Joi.string().required(),
        registrationType: Joi.string().required(),
        registrationDate: Joi.string().required(),
        registrationNumber: Joi.string().required(),
        brandModel: Joi.string().required(),
        mileage: Joi.number().required(),
        year: Joi.number().required(),
        seat: Joi.number().required(),
        color: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.object({
            houseOrRoadName: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
        }).required(),
        image: Joi.array().items(
            Joi.object({
                url: Joi.string(),
                filename: Joi.string(),
            })
        ),
    }).required(),
});

module.exports.complainSchema = Joi.object({
    complain: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().valid('pending', 'In Progress', 'complete'),
        adminSend: Joi.string(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().required(),
    }).required()
});
