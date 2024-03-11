import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CommonNotFoundException } from 'src/exception/not-found.exception';
import { ArtistDto } from './dto/artist.dto';
import { Artist } from './entity/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async getArtists(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findArtist(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  async findArtistsByIds(ids: string[]): Promise<Artist[]> {
    try {
      return await this.artistRepository.findBy({ id: In(ids) })
    } catch(error) {
      console.log('Error finding artists: ', error)
      return []
    }
  }

  async createArtist(artistDto: ArtistDto): Promise<Artist> {
    const newArtist = {} as Artist;

    newArtist.id = uuidv4();
    newArtist.name = artistDto.name;
    newArtist.grammy = artistDto.grammy ?? false;

    const artist = await this.artistRepository.create(newArtist);

    return await this.artistRepository.save(artist);
  }

  async updateArtist(id: string, artistDto: ArtistDto): Promise<Artist> {
    const artistToUpdate = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artistToUpdate) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    const updatedArtist = Object.assign({}, artistToUpdate);
    updatedArtist.name = artistDto.name;
    updatedArtist.grammy = artistDto.grammy ?? false;

    return await this.artistRepository.save(updatedArtist);
  }

  async deleteArtist(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    await this.artistRepository.delete(id);
    await this.trackService.removeArtistDataFromTrack(id);
    await this.albumService.removeArtistDataFromAlbum(id);
  }
}
