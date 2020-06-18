const LegacyTransportStream = jest.requireActual("winston-transport/legacy");

LegacyTransportStream.prototype._deprecated = jest.fn();

module.exports = LegacyTransportStream;
