import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './interfaces/track.interface';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  getTracks(): Track[] {
    return this.tracks;
  }

  findTrack(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  createTrack(trackDto: TrackDto): Track {
    const newTrack = {} as Track;
    newTrack.id = uuidv4();
    newTrack.name = trackDto.name;
    newTrack.albumId = trackDto.albumId ?? null;
    newTrack.artistId = trackDto.artistId ?? null;
    newTrack.duration = trackDto.duration;

    this.tracks = [...this.tracks, newTrack];

    return newTrack;
  }

  updateTrack(track: Track, trackDto: TrackDto): Track {
    const clonedTrack = Object.assign({}, track);
    clonedTrack.name = trackDto.name;
    clonedTrack.albumId = trackDto.albumId || track.albumId;
    clonedTrack.artistId = trackDto.artistId || track.artistId;
    clonedTrack.duration = trackDto.duration || track.duration;

    this.tracks = this.tracks.map((track) => {
      if (track.id === clonedTrack.id) {
        return clonedTrack;
      }
      return track;
    });

    this.tracks = [...this.tracks, clonedTrack];

    return clonedTrack;
  }

  deleteTrack(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
