import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  artistId?: string;

  @ApiProperty()
  albumId?: string;
}

export class TrackResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  artistId: string | null;

  @ApiProperty()
  albumId: string | null;

  @ApiProperty()
  duration: number;
}
