import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AlbumDto, AlbumResponseDto } from './dto/album.dto';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  private albums: AlbumResponseDto[] = [];

  getAlbums(): AlbumResponseDto[] {
    return this.albums;
  }

  findAlbum(id): AlbumResponseDto {
    return this.albums.find((album) => album.id === id);
  }

  createAlbum(albumDto: AlbumDto): AlbumResponseDto {
    const newAlbum = {} as AlbumResponseDto;

    newAlbum.id = uuidv4();
    newAlbum.name = albumDto.name;
    newAlbum.year = albumDto.year;
    newAlbum.artistId = albumDto.artistId ?? null;

    this.albums = [...this.albums, newAlbum];

    return newAlbum;
  }

  updateAlbum(
    albumToUpdate: AlbumResponseDto,
    albumDto: AlbumDto,
  ): AlbumResponseDto {
    const updatedAlbum = Object.assign({}, albumToUpdate);
    updatedAlbum.name = albumDto.name;
    updatedAlbum.year = albumDto.year;
    updatedAlbum.artistId = albumDto.artistId ?? null;

    this.albums = this.albums.map((album) => {
      return album.id === updatedAlbum.id ? updatedAlbum : album;
    });

    return updatedAlbum;
  }

  deleteAlbum(id) {
    this.trackService.removeAlbumDataFromTrack(id);
    this.albums = this.albums.filter((album) => album.id !== id);
  }

  removeArtistDataFromAlbum(id: string) {
    this.albums = this.albums.map((album) => {
      if (album.artistId === id) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
