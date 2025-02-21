"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = validateSchema;
function validateSchema(req, schema) {
    const { error, value } = schema.validate(req.body);
    if (error) {
        throw error;
    }
    return value;
}
