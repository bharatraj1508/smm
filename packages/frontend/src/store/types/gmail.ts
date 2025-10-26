export interface EmailQueryParams {
  query?: string;
  maxResults: number;
}

export interface SyncCountResponse {
  count: number;
  latestSyncedAt: Date;
}
