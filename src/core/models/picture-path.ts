
export class PicturePath {
  constructor(private params: { owner: string; pictureId: string }) {}

  path(): string {
    return `${this.params.owner}/pictures/${this.params.pictureId}.png`;
  }
  pictureId(): string {
    return this.params.pictureId;
  }
}
