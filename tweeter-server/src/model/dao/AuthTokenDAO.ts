export interface AuthTokenDAO {
  putAuthToken(token: string, userAlias: string, timestamp: number): Promise<void>;
  getAuthToken(token: string): Promise<{ userAlias: string; timestamp: number } | null>;
  deleteAuthToken(token: string): Promise<void>;
}

