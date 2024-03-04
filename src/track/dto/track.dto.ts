import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class TrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  duration: number;

  artistId?: string;
  albumId?: string;
}
