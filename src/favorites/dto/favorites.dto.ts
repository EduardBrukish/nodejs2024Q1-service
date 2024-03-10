import { ApiProperty } from '@nestjs/swagger';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';
import { TrackResponseDto } from '../../track/dto/track.dto';

export class FavoritesResponseDto {
  @ApiProperty({ type: [Artist] })
  artists: Artist[];

  @ApiProperty({ type: [Album] })
  albums: Album[];

  @ApiProperty({ type: [TrackResponseDto] })
  tracks: TrackResponseDto[];
}