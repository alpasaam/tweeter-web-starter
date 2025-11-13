import { TweeterRequest } from "./TweeterRequest";

/**
 * Base interface for authenticated Tweeter API requests.
 * All requests that require authentication should extend this interface.
 */
export interface AuthenticatedRequest extends TweeterRequest {
  readonly token: string;
}

