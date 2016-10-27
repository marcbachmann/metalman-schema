var util = require('util')
var AJV = require('ajv')

module.exports = defaultValidationMiddleware
defaultValidationMiddleware.factory = validationMiddlewareFactory

function defaultValidationMiddleware (config) {
  return validationMiddlewareFactory({
    ajvOptions: {useDefaults: true, jsonPointers: true, allErrors: false},
    transform: function transformErrors (errors) {
      return new ValidationError(errors, transformErrors)
    }
  })(config)
}

function validationMiddlewareFactory (opts) {
  var transform = opts.transform
  var ajv = new AJV(opts.ajvOptions)

  return function schemaValidationMiddleware (config) {
    if (typeof config.schema !== 'object') return

    var validator = ajv.compile(config.schema)
    return function validate (cmd, next) {
      if (validator(cmd)) return next()
      return next(transform(validator.errors))
    }
  }
}

util.inherits(ValidationError, Error)
function ValidationError (errors, exclude) {
  this.name = this.constructor.name
  this.errors = errors
  this.message = "Value at path '" + errors[0].dataPath + "' " + errors[0].message
  Error.call(this)
  Error.captureStackTrace(this, exclude)
}
