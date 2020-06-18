declare module "aws-sdk/clients/ses" {
  interface SESHeader {
    name: string;
    value: string;
  }

  export interface SESMessage {
    mail: {
      timestamp: string;
      source: string;
      destination: string[];
      headers: SESHeader[];
      messageId: string;
      commonHeaders: {
        returnPath: string;
        from: string[];
        date: string;
        to: string[];
        subject: string;
      };
    };
    receipt: {
      timestamp: string;
      recipients: string[];
      action: {
        type: "S3";
        bucketName: string;
        objectKey: string;
      };
    };
  }

  export interface EmailEventSNSNotificationRecord {
    Sns: {
      MessageId: string;
      Timestamp: string;
      Message: string; // coerces to SESMessage when JSON.Parsed
    };
  }

  export interface EmailEventSNSNotification {
    Records: EmailEventSNSNotificationRecord[];
  }
}
