export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  readonly imageStringBase64: string;
  readonly imageFileExtension: string;
}
