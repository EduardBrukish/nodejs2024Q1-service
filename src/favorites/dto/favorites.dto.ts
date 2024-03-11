import { ApiProperty } from '@nestjs/swagger';
import { ArtistResponseDto } from '../../artist/dto/artist.dto';
import { AlbumResponseDto } from '../../album/dto/album.dto';
import { TrackResponseDto } from '../../track/dto/track.dto';

export class FavoritesResponseDto {
  @ApiProperty({ type: [ArtistResponseDto] })
  artists: ArtistResponseDto[];

  @ApiProperty({ type: [AlbumResponseDto] })
  albums: AlbumResponseDto[];

  @ApiProperty({ type: [TrackResponseDto] })
  tracks: TrackResponseDto[];
}