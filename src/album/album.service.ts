import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './interfaces/album.interface';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  getAlbums(): Album[] {
    return this.albums;
  }

  findAlbum(id): Album {
    return this.albums.find((album) => album.id === id);
  }

  createAlbum(albumDto: AlbumDto): Album {
    const newAlbum = {} as Album;

    newAlbum.id = uuidv4();
    newAlbum.name = albumDto.name;
    newAlbum.year = albumDto.year;
    newAlbum.artistId = albumDto.artistId ?? null;

    this.albums = [...this.albums, newAlbum];

    return newAlbum;
  }

  updateAlbum(albumToUpdate: Album, albumDto: AlbumDto): Album {
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
    this.albums = this.albums.filter((album) => album.id !== id);
  }
}
