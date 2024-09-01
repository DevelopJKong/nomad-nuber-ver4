export interface MailModuleOptions {
  service: string;
  host: string;
  port: string;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
