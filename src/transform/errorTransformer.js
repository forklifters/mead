const Boom = require('boom')
const ValidationError = require('../errors/validationError')

const matchers = [
  ['unsupported image format', Boom.unsupportedMediaType],
  ['buffer has corrupt header', Boom.unsupportedMediaType],
  ['bad extract area', Boom.badRequest]
]

module.exports = err => {
  if (err instanceof ValidationError) {
    return Boom.badRequest(err)
  }

  for (let i = 0, matcher; matcher = matchers[i]; i++) { // eslint-disable-line no-cond-assign
    const [substring, handler] = matcher
    if ((err.message || '').includes(substring)) {
      return handler(substring)
    }
  }

  if (!(err instanceof Error)) {
    return Boom.internal(err.message || err)
  }

  return err.isBoom ? err : Boom.wrap(err)
}
