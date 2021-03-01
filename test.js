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
      foo: {type: 'number'}
    }
  }
})

// Missing property
fn({}, function (err) {
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'ValidationError')
  assert.equal(err.message, "Value at path '' should have required property 'foo'")
  assert.ok(err.stack)
  assert.ok(Array.isArray(err.errors))
})

// Wrong type
fn({foo: 'bar'}, function (err) {
  assert.ok(err)
  assert.equal(err.message, "Value at path '/foo' should be number")
})

// Additional property
fn({foo: 1, test: 'bar'}, function (err) {
  assert.ok(err)
  assert.equal(err.message, "Value at path '' should NOT have additional properties")
})

// Success
fn({foo: 1}, assert.ifError)
