// tslint:disable no-empty
const SlackMessage = jest.fn();

SlackMessage.prototype.send = jest.fn(() => Promise.resolve());

export default SlackMessage;
