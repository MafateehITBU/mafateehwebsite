export type ContactStatus = "NEW" | "READ" | "ARCHIVED";

export interface IContact {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  service: string | null;
  inquiry: string;
  status: ContactStatus;
  createdAt: string;
}
