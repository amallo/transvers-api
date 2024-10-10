import { Readable } from "stream";

type SaveParams = {
    id: string,
    picture: Readable,
    owner: string,
    path: string
}
export interface PictureRepository{
    save(params: SaveParams): Promise<void>
}