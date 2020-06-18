import { format } from "logform";
import { createLogger, transports } from "winston";

import { IS_PROD } from "../constants";

const defaultFormat = [format.errors({ stack: true })];

export const debugFormat = format.combine(
  format.colorize(),
  ...defaultFormat,
  format.printf((info) => {
    if (info.stack) {
      info.message = info.stack;
    }

    return info.level && info.message
      ? `${info.level}: \t${
          typeof info.message === "string"
            ? info.message.split("\n").join("\n\t")
            : JSON.stringify(info.message, null, 2)
        }`
      : String(info);
  }),
);

export const cloudwatchFormat = format.combine(
  ...defaultFormat,
  format.timestamp(),
  format.json(),
);

export default createLogger({
  level: "info",
  format: IS_PROD ? cloudwatchFormat : debugFormat,
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL,
    }),
  ],
});
