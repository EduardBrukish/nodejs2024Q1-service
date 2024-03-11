import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArtistDto, ArtistResponseDto } from './dto/artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  private artists: ArtistResponseDto[] = [];

  getArtists(): ArtistResponseDto[] {
    return this.artists;
  }

  findArtist(id): ArtistResponseDto {
    return this.artists.find((artist) => artist.id === id);
  }

  createArtist(artistDto: ArtistDto): ArtistResponseDto {
    const newArtist = {} as ArtistResponseDto;

    newArtist.id = uuidv4();
    newArtist.name = artistDto.name;
    newArtist.grammy = artistDto.grammy ?? false;

    this.artists = [...this.artists, newArtist];

    return newArtist;
  }

  updateArtist(artistToUpdate: ArtistResponseDto, artistDto: ArtistDto): ArtistResponseDto {
    const updatedArtist = Object.assign({}, artistToUpdate);
    updatedArtist.name = artistDto.name;
    updatedArtist.grammy = artistDto.grammy ?? false;

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
