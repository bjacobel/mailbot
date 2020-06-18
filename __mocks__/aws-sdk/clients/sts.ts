import { GetCallerIdentityResponse } from "aws-sdk/clients/sts";

// eslint-disable-next-line
function STS() {}

STS.prototype.getCallerIdentity = jest.fn(
  (
    params: {},
    callback: (err: Error | undefined, data: GetCallerIdentityResponse) => void,
  ) => {
    callback(undefined, {
      Account: "123456789123",
    } as GetCallerIdentityResponse);
  },
);

module.exports = STS;
