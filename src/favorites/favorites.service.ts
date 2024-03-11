import { Injectable, Inject, forwardRef, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  // Favorites,
  FavoriteCategories,
} from './interfaces/favorites.interface';
import { FavoritesResponseDto } from './dto/favorites.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorites } from './entity/favorites.entity';

@Injectable({})
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @InjectRepository(Favorites) private favoritesRepository: Repository<Favorites>,
  ) {}

  private favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async getFavorites(): Promise<FavoritesResponseDto> {
    const favoritesTracks = await this.trackService.findTracksByIds(this.favs.tracks);
    const favoritesAlbums = await this.albumService.findAlbumsByIds(this.favs.albums);
    const favoritesArtists = await this.artistService.findArtistsByIds(this.favs.artists);

    return {
      tracks: favoritesTracks,
      albums: favoritesAlbums,
      artists: favoritesArtists,
    };
  }

  async addFavoriteTrack(id: string): Promise<string> {
    const track = await this.trackService.findTrack(id);

    if (!track) {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }


    return `Track with ID ${id} was added to the favorites`;
  }

  findFavoriteByCategory(category: FavoriteCategories, id: string) {
    const categoryToSearch: string[] = this.favs[category];

    return categoryToSearch.find((categoryItemId) => categoryItemId === id);
  }

  addToFavoriteByCategory(category: FavoriteCategories, id: string) {
    this.favs = { ...this.favs, [category]: [...this.favs[category], id] };
  }

  removeFromFavoriteByCategory(category: FavoriteCategories, id: string) {
    const updatedCategory = this.favs[category].filter(
      (itemId) => itemId !== id,
    );
    this.favs = { ...this.favs, [category]: updatedCategory };
  }
}
