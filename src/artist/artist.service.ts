import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './interfaces/artist.interface';
import { ArtistDto } from './dto/artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  private artists: Artist[] = [];

  getArtists(): Artist[] {
    return this.artists;
  }

  findArtist(id): Artist {
    return this.artists.find((artist) => artist.id === id);
  }

  createArtist(artistDto: ArtistDto): Artist {
    const newArtist = {} as Artist;

    newArtist.id = uuidv4();
    newArtist.name = artistDto.name;
    newArtist.grammy = artistDto.grammy ?? false;

    this.artists = [...this.artists, newArtist];

    return newArtist;
  }

  updateArtist(artistToUpdate: Artist, artistDto: ArtistDto): Artist {
    const updatedArtist = Object.assign({}, artistToUpdate);
    updatedArtist.name = artistDto.name;
    artistToUpdate.grammy = artistDto.grammy ?? false;

    this.artists = this.artists.map((artist) => {
      return artist.id === updatedArtist.id ? updatedArtist : artist;
    });

    return updatedArtist;
  }

  deleteArtist(id) {
    this.albumService.removeArtistDataFromAlbum(id);
    this.trackService.removeArtistDataFromTrack(id);
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
