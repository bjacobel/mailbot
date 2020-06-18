// tslint:disable no-empty
const SlackMessage = jest.fn();

SlackMessage.prototype._transform = jest.fn(() => {});

export default SlackMessage;
