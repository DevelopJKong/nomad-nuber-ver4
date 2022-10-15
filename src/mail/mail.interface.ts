export interface MailModuleOptions {
  service: string;
  host: string;
  port: string;
  secure: boolean;
  auth: {
    user: string;
    password: string;
  };
}

