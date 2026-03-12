const logger = require('../utils/logger');
const { ERRORS } = require('../config/constants');

/**
 * Validates request payload against a generic Joi schema
 * @param {Object} schema - Joi schema object
 * @param {String} source - Specifies location to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        if (!schema) return next();

        const { error, value } = schema.validate(req[source], {
            abortEarly: false,     // report all errors, not just the first one
            stripUnknown: true,     // remove unknown keys preventing injection attacks
        });

        if (error) {
            const errorDetails = error.details.map((detail) => detail.message).join(', ');
            logger.warn(`Validation failed for ${req.method} ${req.url}: ${errorDetails}`);

            return res.status(400).json({
                success: false,
                message: `${ERRORS.VALIDATION.FAILED}: ${errorDetails}`,
                data: null,
            });
        }

        // Overwrite req body/query with validated and stripped data
        req[source] = value;
        next();
    };
};

module.exports = { validate };
