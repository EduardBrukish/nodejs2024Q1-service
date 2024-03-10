import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UsePipes,
  ParseUUIDPipe,
  UnprocessableEntityException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { TrackService } from '../track/track.service';
import { FavoritesResponseDto } from './dto/favorites.dto'
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { CommonNotFoundException } from '../exception/not-found.exception';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(
    private favoritesService: FavoritesService,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [FavoritesResponseDto] })
  async getFavorites(): Promise<FavoritesResponseDto> {
    return await this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: 'The track was successfully added to the favorites.' })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiUnprocessableEntityResponse({ description: 'Track with ID ${id} does not exist' })
  @UsePipes(ParseUUIDPipe)
  addFavoriteTrack(@Param('id') id: string): string {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }

    this.favoritesService.addToFavoriteByCategory('tracks', id);

    return `Track with ID ${id} was added to the favorites`;
  }

  @Delete('track/:id')
  @ApiNoContentResponse({
    description: 'Track with ID ${id} was deleted from favorites',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found in favorites' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  removeFavoriteTrack(@Param('id') id: string): string {
    const categoryItemId = this.favoritesService.findFavoriteByCategory(
      'tracks',
      id,
    );

    if (!categoryItemId) {
      throw new CommonNotFoundException(`Track with ID ${id} isn't favorite`);
    }

    this.favoritesService.removeFromFavoriteByCategory('tracks', id);

    return `Track with ID ${id} was deleted from favorites`;
  }

  // @Post('album/:id')
  // @ApiCreatedResponse({ description: 'The album was successfully added to the favorites.' })
  // @ApiBadRequestResponse({ description: 'Invalid Id' })
  // @ApiUnprocessableEntityResponse({ description: 'Album with ID ${id} does not exist' })
  // @UsePipes(ParseUUIDPipe)
  // addFavoriteAlbum(@Param('id') id: string): string {
  //   const categoryItemId = this.albumService.findAlbum(id);

  //   if (!categoryItemId) {
  //     throw new UnprocessableEntityException(
  //       `Album with ID ${id} doesn't exist`,
  //     );
  //   }

  //   this.favoritesService.addToFavoriteByCategory('albums', id);

  //   return `Album with ID ${id} was added to the favorites`;
  // }

  // @Delete('album/:id')
  // @ApiNoContentResponse({
  //   description: 'Album with ID ${id} was deleted from favorites',
  // })
  // @ApiBadRequestResponse({ description: 'Invalid Id' })
  // @ApiNotFoundResponse({ description: 'Album with ID ${id} not found in favorites' })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @UsePipes(ParseUUIDPipe)
  // removeFavoriteAlbum(@Param('id') id: string): string {
  //   const categoryItemId = this.favoritesService.findFavoriteByCategory(
  //     'albums',
  //     id,
  //   );

  //   if (!categoryItemId) {
  //     throw new CommonNotFoundException(`Album with ID ${id} isn't favorite`);
  //   }

  //   this.favoritesService.removeFromFavoriteByCategory('albums', id);

  //   return `Album with ID ${id} was deleted from favorites`;
  // }

  @Post('artist/:id')
  @ApiCreatedResponse({ description: 'The artist was successfully added to the favorites.' })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiUnprocessableEntityResponse({ description: 'Artist with ID ${id} does not exist' })
  @UsePipes(ParseUUIDPipe)
  addFavoriteArtist(@Param('id') id: string): string {
    const artist = this.artistService.findArtist(id);

    if (!artist) {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }

    this.favoritesService.addToFavoriteByCategory('artists', id);

    return `Artist with ID ${id} was added to the favorites`;
  }

  @Delete('artist/:id')
  @ApiNoContentResponse({
    description: 'Artist with ID ${id} was deleted from favorites',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found in favorites' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  removeFavoriteArtist(@Param('id') id: string): string {
    const categoryItemId = this.favoritesService.findFavoriteByCategory(
      'artists',
      id,
    );

    if (!categoryItemId) {
      throw new CommonNotFoundException(`Artist with ID ${id} isn't favorite`);
    }

    this.favoritesService.removeFromFavoriteByCategory('artists', id);

    return `Artist with ID ${id} was deleted from favorites`;
  }
}
