import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlbumDto } from './dto/album.dto';
import { Album } from './entity/album.entity';
import { TrackService } from '../track/track.service';
import { CommonNotFoundException } from '../exception/not-found.exception';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  private albums: Album[] = [];

  async getAlbums(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findAlbum(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  async findAlbumsByIds(ids: string[]): Promise<Album[]> {
    try {
      return await this.albumRepository.findBy({ id: In(ids) })
    } catch(error) {
      console.log('Error finding albums: ', error)
      return []
    }
  }

  async createAlbum(albumDto: AlbumDto): Promise<Album> {
    const newAlbum = {} as Album;

    newAlbum.id = uuidv4();
    newAlbum.name = albumDto.name;
    newAlbum.year = albumDto.year;
    newAlbum.artistId = albumDto.artistId ?? null;

    const album = await this.albumRepository.create(newAlbum);

    return await this.albumRepository.save(album);
  }

  async updateAlbum(id: string, albumDto: AlbumDto): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    const updatedAlbum = Object.assign({}, album);
    updatedAlbum.name = albumDto.name;
    updatedAlbum.year = albumDto.year;
    updatedAlbum.artistId = albumDto.artistId ?? null;

    return await this.albumRepository.save(updatedAlbum);
  }

  async deleteAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    await this.albumRepository.delete(id);
    await this.trackService.removeAlbumDataFromTrack(id);
  }

  async removeArtistDataFromAlbum(artistId: string) {
    await this.albumRepository
      .createQueryBuilder()
      .update(Album)
      .set({ artistId: null })
      .where({ artistId })
      .execute()
  }
}
