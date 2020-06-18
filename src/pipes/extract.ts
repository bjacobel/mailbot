import { Transform } from "stream";

export default (): Transform => {
  const extractContent = new Transform({ objectMode: true });
  extractContent._transform = (
    data,
    encoding,
    callback: (err: Error | undefined, html?: string) => void,
  ) => {
    if (data.type === "text") {
      callback(undefined, data.html);
    } else {
      callback(undefined);
    }
  };

  return extractContent;
};
