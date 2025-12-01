export interface S3DAO {
  uploadImage(
    imageStringBase64: string,
    imageFileExtension: string,
    alias: string
  ): Promise<string>;
}

