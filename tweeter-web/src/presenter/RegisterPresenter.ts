import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { AuthView } from "./Presenter";
import { AuthItemPresenter } from "./AuthItemPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends AuthItemPresenter<RegisterView> {
  protected doAuthenticatedOperation(
    userAlias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]> {
    return this.service.register(
      firstName!,
      lastName!,
      userAlias,
      password,
      imageBytes!,
      imageFileExtension!
    );
  }
  protected notifyAndNavigate(
    originalUrl: string | undefined,
    user: User
  ): void {
    this.view.navigate(`/feed/${user.alias}`);
  }
  protected itemDescription(): string {
    return "register user";
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
}
