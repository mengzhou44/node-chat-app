const { generateMessage, generateLocationMessage } = require('./message');
const expect = require('expect');

const from = 'daniel';
const text = 'hello';

describe('generateMessage', () => {
  it('should create message object', () => {
    var message = generateMessage(from, text);
    expect(message).toMatchObject({
      from,
      text
    });

    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should create location message object', () => {
    var latitude = '12.2333';
    var longitude = '-123.67343';
    var message = generateLocationMessage(from, latitude, longitude);
    expect(message).toMatchObject({
      from
    });

    expect(message.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`);

    expect(typeof message.createdAt).toBe('number');
  });
});
