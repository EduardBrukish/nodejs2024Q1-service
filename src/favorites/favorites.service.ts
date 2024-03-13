import {
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesResponseDto } from './dto/favorites.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorites } from './entity/favorites.entity';

const FAVORITES_REPOSITORY_NAME = 'favorites';
const MOCK_FAVORITES = {
  id: FAVORITES_REPOSITORY_NAME,
  artists: [],
  albums: [],
  tracks: [],
};

@Injectable({})
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getFavorites(): Promise<FavoritesResponseDto> {
    const favorites = await this.favoritesRepository.findOne({
      where: { id: FAVORITES_REPOSITORY_NAME },
    });

    const dataToGetFavorites = favorites || MOCK_FAVORITES;

    const favoritesTracks = await this.trackService.findTracksByIds(
      dataToGetFavorites.tracks,
    );
    const favoritesAlbums = await this.albumService.findAlbumsByIds(
      dataToGetFavorites.albums,
    );
    const favoritesArtists = await this.artistService.findArtistsByIds(
      dataToGetFavorites.artists,
    );

    if (!favoritesTracks || !favoritesAlbums || !favoritesArtists) {
      throw new UnprocessableEntityException(`One of the IDs are not valid`);
    }

    return {
      tracks: favoritesTracks,
      albums: favoritesAlbums,
      artists: favoritesArtists,
    };
  }

  async addFavoriteTrack(id: string): Promise<string> {
    try {
      const track = await this.trackService.findTrack(id);

      const favorites = await this.favoritesRepository.findOne({
        where: { id: FAVORITES_REPOSITORY_NAME },
      });
      const dataToGetFavorites = favorites || MOCK_FAVORITES;

      const favoritesToSave = Object.assign({}, dataToGetFavorites);
      favoritesToSave.id = FAVORITES_REPOSITORY_NAME;
      favoritesToSave.tracks = [...dataToGetFavorites.tracks, track.id];

      await this.favoritesRepository.save(favoritesToSave);

      return `Track with ID ${id} was added to the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }
  }

  async deleteFavoriteTrack(id: string): Promise<string> {
    try {
      const track = await this.trackService.findTrack(id);

      const favorites = await this.favoritesRepository.findOne({
        where: { id: FAVORITES_REPOSITORY_NAME },
      });
      const dataToGetFavorites = favorites || MOCK_FAVORITES;

      const favoritesToSave = Object.assign({}, dataToGetFavorites);
      favoritesToSave.id = FAVORITES_REPOSITORY_NAME;
      favoritesToSave.tracks = favorites.tracks.filter(
        (favoriteTrackId) => favoriteTrackId !== track.id,
      );

      await this.favoritesRepository.save(favoritesToSave);

      return `Track with ID ${id} was deleted from the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }
  }

  async addFavoriteArtist(id: string): Promise<string> {
    try {
      const artist = await this.artistService.findArtist(id);

      const favorites = await this.favoritesRepository.findOne({
        where: { id: FAVORITES_REPOSITORY_NAME },
      });
      const dataToGetFavorites = favorites || MOCK_FAVORITES;

      const favoritesToSave = Object.assign({}, dataToGetFavorites);
      favoritesToSave.id = FAVORITES_REPOSITORY_NAME;
      favoritesToSave.artists = [...dataToGetFavorites.artists, artist.id];

      await this.favoritesRepository.save(favoritesToSave);

      return `Artist with ID ${id} was added to the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }
  }

  async deleteFavoriteArtist(id: string): Promise<string> {
    try {
      const artist = await this.artistService.findArtist(id);

      const favorites = await this.favoritesRepository.findOne({
        where: { id: FAVORITES_REPOSITORY_NAME },
      });
      const dataToGetFavorites = favorites || MOCK_FAVORITES;

      const favoritesToSave = Object.assign({}, dataToGetFavorites);
      favoritesToSave.id = FAVORITES_REPOSITORY_NAME;
      favoritesToSave.artists = dataToGetFavorites.artists.filter(
        (favoriteArtistId) => favoriteArtistId !== artist.id,
      );

      await this.favoritesRepository.save(favoritesToSave);

      return `Track with ID ${id} was deleted from the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Artist with ID ${id} doesn't exist`,
      );
    }
  }

  async addFavoriteAlbum(id: string): Promise<string> {
    try {
      const album = await this.albumService.findAlbum(id);

      const favorites = await this.favoritesRepository.findOne({
        where: { id: FAVORITES_REPOSITORY_NAME },
      });
      const dataToGetFavorites = favorites || MOCK_FAVORITES;

      const favoritesToSave = Object.assign({}, dataToGetFavorites);
      favoritesToSave.id = FAVORITES_REPOSITORY_NAME;
      favoritesToSave.albums = [...dataToGetFavorites.albums, album.id];

      await this.favoritesRepository.save(favoritesToSave);

      return `Album with ID ${id} was added to the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Album with ID ${id} doesn't exist`,
      );
    }
  }

  async deleteFavoriteAlbum(id: string): Promise<string> {
    try {
      const album = await this.albumService.findAlbum(id);

      const favorites = await this.favoritesRepository.findOne({
        where: { id: FAVORITES_REPOSITORY_NAME },
      });
      const dataToGetFavorites = favorites || MOCK_FAVORITES;

      const favoritesToSave = Object.assign({}, dataToGetFavorites);
      favoritesToSave.id = FAVORITES_REPOSITORY_NAME;
      favoritesToSave.albums = favorites.albums.filter(
        (favoriteAlbumId) => favoriteAlbumId !== album.id,
      );

      await this.favoritesRepository.save(favoritesToSave);

      return `Album with ID ${id} was deleted from the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Album with ID ${id} doesn't exist`,
      );
    }
  }
}
