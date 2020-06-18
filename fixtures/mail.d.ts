import { EmailEventSNSNotificationRecord } from "aws-sdk/clients/ses";

declare module "mail.json" {
  export const Records: EmailEventSNSNotificationRecord[];
}
