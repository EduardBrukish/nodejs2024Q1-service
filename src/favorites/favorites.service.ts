import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Favorites } from './interfaces/favorites.interface';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable({})
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService)) private readonly artistService: ArtistService,
  ) {}

  private favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getFavorites(): Favorites {
    this.trackService.createTrack({
      name: 'test',
      duration: 2020
    })
    console.log('track', this.trackService.getTracks())
    console.log('album', this.albumService.getAlbums())
    console.log('artist', this.artistService.getArtists())
    
    return this.favs;
  }
}
