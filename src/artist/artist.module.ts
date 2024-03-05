import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [AlbumModule, TrackModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
