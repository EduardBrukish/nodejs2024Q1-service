import { Injectable } from "@nestjs/common";

@Injectable({})
export class ArtistService {
  getArtists() {
    return 'Artists are here'
  }
}