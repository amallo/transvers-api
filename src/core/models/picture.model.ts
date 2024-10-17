import { PicturePath } from './picture-path';
export interface PictureProperties {
  id: string;
  owner: string;
  path: string;
}

export class PictureModel implements PictureProperties {
  constructor(
    private readonly _id: string,
    private readonly _owner: string,
  ) {}

  public get id(): string {
    return this._id;
  }

  public get owner(): string {
    return this._owner;
  }

  public get path(): string {
    return new PicturePath({ owner: this._owner, pictureId: this._id }).path();
  }

  public get properties(): PictureProperties {
    return {
      id: this.id,
      owner: this.owner,
      path: this.path,
    };
  }
}
