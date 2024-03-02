import { Injectable } from "@nestjs/common";

@Injectable({})
export class AlbumService {
  getAlbums(): string {
    return 'Now you have all albums';
  }
}