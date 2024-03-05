import {
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TrackService } from '../track/track.service';
import { Favorites } from './interfaces/favorites.interface';

@Controller('favs')
export class FavoritesController {
  constructor(
    private favoritesService: FavoritesService,
    private trackService: TrackService,
  ) {}

  @Get()
  getFavorites(): Favorites {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @UsePipes(ParseUUIDPipe)
  addFavoritesTrack(@Param('id') id: string): string {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }

    return `Track with ID ${id} was added to the favorites`;
  }
}
