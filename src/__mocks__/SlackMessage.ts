// tslint:disable no-empty
const SlackMessage = jest.fn();

SlackMessage.prototype._transform = jest.fn(() => undefined);
SlackMessage.prototype.send = jest.fn(() => Promise.resolve());

export default SlackMessage;
