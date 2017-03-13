# metalman-schema

[![Greenkeeper badge](https://badges.greenkeeper.io/marcbachmann/metalman-schema.svg)](https://greenkeeper.io/)

A JSON schema validation middleware for the metalman module.


```js
var metalman = require('metalman')
var action = require('metalman-action')

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

fn({foo: 'bar'}, function (err) {
  // err instanceof Error
  // err.name equals 'ValidationError'
  // err.message equals "Value at path '/foo' should be number"
})

fn({foo: 1}, function (err) {
  // err equals null if the schema is valid
})

```
