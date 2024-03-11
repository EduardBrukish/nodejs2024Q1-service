import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TrackDto, TrackResponseDto } from './dto/track.dto';

@Injectable()
export class TrackService {
  private tracks: TrackResponseDto[] = [];

  getTracks(): TrackResponseDto[] {
    return this.tracks;
  }

  findTrack(id: string): TrackResponseDto | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  createTrack(trackDto: TrackDto): TrackResponseDto {
    const newTrack = {} as TrackResponseDto;
    newTrack.id = uuidv4();
    newTrack.name = trackDto.name;
    newTrack.albumId = trackDto.albumId ?? null;
    newTrack.artistId = trackDto.artistId ?? null;
    newTrack.duration = trackDto.duration;

    this.tracks = [...this.tracks, newTrack];

    return newTrack;
  }

  updateTrack(track: TrackResponseDto, trackDto: TrackDto): TrackResponseDto {
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
