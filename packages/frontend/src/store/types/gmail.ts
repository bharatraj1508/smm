export interface EmailQueryParams {
  query?: string;
  maxResults: number;
  page?: number;
}

export interface SyncCountResponse {
  count: number;
  latestSyncedAt: Date;
}

export interface EmailData {
  _id: string;
  body: string;
  createdAt: Date;
  date: Date;
  front: string;
  isRead: boolean;
  labels: string[];
  lastSyncedAt: Date;
  mailId: string;
  snippet: string;
  subject: string;
  threadId: string;
  to: string[];
  updatedAt: Date;
  user: {
    name: string;
    email: string;
    _id: string;
  };
}

export interface GetEmailsResponse {
  count: number;
  data: EmailData[];
  message: string;
  page: number;
  success: boolean;
}
