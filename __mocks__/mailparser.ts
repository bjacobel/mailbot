import { Transform } from "stream";
import { inherits } from "util";

export const MailParser = jest.fn(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore 2683
  Transform.call(this, { objectMode: true });
});
inherits(MailParser, Transform);

interface TextData {
  [name: string]: string;
  type: "text";
}

MailParser.prototype._transform = jest.fn(
  (
    data: string,
    encoding: string,
    callback: (err: Error | undefined, data: TextData) => void,
  ) => {
    callback(undefined, { html: data.toString(), type: "text" });
  },
);
