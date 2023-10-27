const {StatusCodes} = require('http-status-codes')
const {CustomAPIError} = require('./custom-api')
const { model } = require('mongoose')

class BadRequestError extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

model.exports = BadRequestError