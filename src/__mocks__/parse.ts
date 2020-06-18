import { ChatPostMessageArguments } from "@slack/client";

export const parseEmailBody = (body: string): ChatPostMessageArguments => {
  return {
    channel: "general",
    text: "a mocked message",
  };
};
