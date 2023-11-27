var assert = require('assert')
var metalman = require('metalman')
var validate = require('./')

var command = metalman([validate])
var fn = command({
  schema: {
    type: 'object',
    required: ['foo'],
    additionalProperties: false,
    properties: {
      foo: {type: 'number'},
      bar: {type: 'string', format: 'uri'}
    }
  }
})

// Missing property
fn({}, function (err) {
  assert.ok(err instanceof Error)
  assert.strictEqual(err.name, 'ValidationError')
  assert.strictEqual(err.message, "Value at path '' should have required property 'foo'")
  assert.ok(err.stack)
  assert.ok(Array.isArray(err.errors))
})

// Wrong type
fn({foo: 'bar'}, function (err) {
  assert.ok(err)
  assert.strictEqual(err.message, "Value at path '/foo' should be number")
})

// Additional property
fn({foo: 1, test: 'bar'}, function (err) {
  assert.ok(err)
  assert.strictEqual(err.message, "Value at path '' should NOT have additional properties")
})

// Success
fn({foo: 1}, assert.ifError)

// Does not mutate respond value
fn({foo: 1}, function (err, res) {
  assert.ifError(err)
  assert.strictEqual(res, undefined)
})

// Default formats get registered if no custom ajv instance is used
fn({foo: 1, bar: 'https://example.com'}, assert.ifError)
