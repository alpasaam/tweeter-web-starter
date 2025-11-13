import { TweeterResponse } from "./TweeterResponse";

/**
 * Generic response interface for paginated item responses.
 * @template T The type of items in the array (e.g., UserDto, StatusDto)
 */
export interface PagedItemResponse<T> extends TweeterResponse {
  readonly items: T[] | null;
  readonly hasMore: boolean;
}

