import { ApiProperty } from '@nestjs/swagger';
import { ArtistResponseDto } from '../../artist/dto/artist.dto';
import { Album } from '../../album/entity/album.entity';
import { TrackResponseDto } from '../../track/dto/track.dto';

export class FavoritesResponseDto {
  @ApiProperty({ type: [ArtistResponseDto] })
  artists: ArtistResponseDto[];

  @ApiProperty({ type: [Album] })
  albums: Album[];

  @ApiProperty({ type: [TrackResponseDto] })
  tracks: TrackResponseDto[];
}