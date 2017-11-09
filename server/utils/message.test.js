const { generateMessage } = require('./message');
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
