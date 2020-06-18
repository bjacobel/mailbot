import { EventEmitter } from "events";

export const { createLogger } = jest.requireActual("winston");

const Console = jest.fn();
Console.prototype.__proto__ = EventEmitter.prototype;
Console.prototype.constructor = jest.fn();
Console.prototype.log = jest.fn();
export const transports = {
  Console,
};
