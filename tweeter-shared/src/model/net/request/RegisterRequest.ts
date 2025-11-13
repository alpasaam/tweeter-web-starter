import { AuthenticationCredentials } from "./AuthenticationCredentials";

export interface RegisterRequest extends AuthenticationCredentials {
  readonly firstName: string;
  readonly lastName: string;
  readonly imageStringBase64: string;
  readonly imageFileExtension: string;
}
