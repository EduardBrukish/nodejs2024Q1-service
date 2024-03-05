import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Module({
  imports: [],
  controllers: [FavoritesController],
  providers: [FavoritesService, TrackService, AlbumService, ArtistService],
})
export class FavoritesModule {}
