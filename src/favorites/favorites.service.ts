import { Injectable } from '@nestjs/common';

@Injectable({})
export class FavoritesService {
  getFavorites(): string {
    return 'Now you have all favorites albums';
  }
}
