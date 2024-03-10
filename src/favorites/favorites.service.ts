import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  Favorites,
  FavoriteCategories,
} from './interfaces/favorites.interface';
import { FavoritesResponseDto } from './dto/favorites.dto'
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

  async getFavorites(): Promise<FavoritesResponseDto> {
    const favoritesTracks = this.favs.tracks
      .map((trackId) => this.trackService.findTrack(trackId))
      .filter((track) => Boolean(track));
    const albumsPromises =  this.favs.albums
      .map(async (albumId) => await this.albumService.findAlbum(albumId))
      .filter((album) => Boolean(album));
    const artistsPromises = this.favs.artists
      .map(async (artistId) => await this.artistService.findArtist(artistId))
      .filter((artist) => Boolean(artist));

    const favoritesAlbums = await Promise.all(albumsPromises)
    const favoritesArtists = await Promise.all(artistsPromises)

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
