import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  Favorites,
  FavoritesResponse,
  FavoriteCategories,
} from './interfaces/favorites.interface';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable({})
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  private favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getFavorites(): FavoritesResponse {
    const favoritesTracks = this.favs.tracks
      .map((trackId) => this.trackService.findTrack(trackId))
      .filter((track) => Boolean(track));
    const favoritesAlbums = this.favs.albums
      .map((albumId) => this.albumService.findAlbum(albumId))
      .filter((album) => Boolean(album));
    const favoritesArtists = this.favs.artists
      .map((artistId) => this.artistService.findArtist(artistId))
      .filter((artist) => Boolean(artist));

    return {
      tracks: favoritesTracks,
      albums: favoritesAlbums,
      artists: favoritesArtists,
    };
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
