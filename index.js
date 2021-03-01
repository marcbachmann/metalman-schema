const util = require('util')

module.exports = defaultValidationMiddleware
defaultValidationMiddleware.factory = validationMiddlewareFactory

function defaultValidationMiddleware (config) {
  return validationMiddlewareFactory({
    ajv: undefined,
    ajvOptions: {useDefaults: true, allErrors: false, coerceTypes: true},
    transform: transformErrors
  })(config)
}

function validationMiddlewareFactory (opts) {
  const transform = opts.transform || transformErrors
  if (!opts.ajv) {
    const AJV = require('ajv').default
    opts.ajv = new AJV(opts.ajvOptions)
    require('ajv-formats')(opts.ajv)
  }

  return function schemaValidationMiddleware (config) {
    if (typeof config.schema !== 'object') return

    const validator = opts.ajv.compile(config.schema)
    return function validate (cmd) {
      if (validator(cmd)) return cmd
      throw transform(validator.errors)
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

function transformErrors (errors) {
  return new ValidationError(errors, transformErrors)
}
