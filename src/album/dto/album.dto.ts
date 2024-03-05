import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  artistId?: string | null;
}
