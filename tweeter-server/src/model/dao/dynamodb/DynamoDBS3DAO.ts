import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3DAO } from "../S3DAO";

export class DynamoDBS3DAO implements S3DAO {
  private readonly client = new S3Client({ region: "us-west-2" });
  private readonly bucketName = "tweeter-profile-images-saam";

  async uploadImage(
    imageStringBase64: string,
    imageFileExtension: string,
    alias: string
  ): Promise<string> {
    const imageBuffer = Buffer.from(imageStringBase64, "base64");
    const key = `${alias}.${imageFileExtension}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: `image/${imageFileExtension}`,
    };

    await this.client.send(new PutObjectCommand(params));

    return `https://${this.bucketName}.s3.us-west-2.amazonaws.com/${key}`;
  }
}
