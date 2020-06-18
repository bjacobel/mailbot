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

declare module "github" {
  export interface IUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company?: null;
    blog: string;
    location: string;
    email?: null;
    hireable?: null;
    bio: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  }
}
