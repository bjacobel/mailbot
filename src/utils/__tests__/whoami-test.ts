import * as STS from "aws-sdk/clients/sts";
import whoami from "../whoami";

describe("aws identity helper", () => {
  it("calls sts.getUserIdentity", async () => {
    await whoami();
    expect(STS.prototype.getCallerIdentity).toHaveBeenCalledTimes(1);
  });

  it("gets a string back", async () => {
    expect(await whoami()).toEqual(expect.stringMatching(/^\d{12}$/));
  });
});
