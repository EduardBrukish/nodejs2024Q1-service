import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackDto } from './dto/track.dto';
import { Track } from './entity/track.entity';
import { CommonNotFoundException } from '../exception/not-found.exception';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  private tracks: Track[] = [];

  async getTracks(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findTrack(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  async createTrack(trackDto: TrackDto): Promise<Track> {
    const newTrack = {} as Track;
    newTrack.id = uuidv4();
    newTrack.name = trackDto.name;
    newTrack.albumId = trackDto.albumId ?? null;
    newTrack.artistId = trackDto.artistId ?? null;
    newTrack.duration = trackDto.duration;

    const track = await this.trackRepository.create(newTrack);

    return await this.trackRepository.save(track);
  }

  async updateTrack(id: string, trackDto: TrackDto): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    const clonedTrack = Object.assign({}, track);
    clonedTrack.name = trackDto.name;
    clonedTrack.albumId = trackDto.albumId || null;
    clonedTrack.artistId = trackDto.artistId || null;
    clonedTrack.duration = trackDto.duration || track.duration;

    return await this.trackRepository.save(clonedTrack);
  }

  async deleteTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    await this.trackRepository.delete(id);
  }

  // ToDo remove artist and album data from track
  removeArtistDataFromTrack(artistId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }

  removeAlbumDataFromTrack(albumId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }
      return track;
    });
  }
}
