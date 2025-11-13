import { AuthenticatedRequest } from "./AuthenticatedRequest";

/**
 * Generic request interface for paginated item requests.
 * @template T The type of the lastItem (e.g., UserDto, StatusDto)
 */
export interface PagedItemRequest<T> extends AuthenticatedRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: T | null;
}

