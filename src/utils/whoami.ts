import * as STS from "aws-sdk/clients/sts";

export default (): Promise<string> => {
  const stsClient = new STS();
  return new Promise((resolve, reject) =>
    stsClient.getCallerIdentity({}, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.Account);
    }),
  );
};
