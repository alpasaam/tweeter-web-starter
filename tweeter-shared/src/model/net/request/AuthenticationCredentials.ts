import { TweeterRequest } from "./TweeterRequest";

/**
 * Base interface for authentication requests that require alias and password.
 * Used by both LoginRequest and RegisterRequest.
 */
export interface AuthenticationCredentials extends TweeterRequest {
  readonly alias: string;
  readonly password: string;
}

