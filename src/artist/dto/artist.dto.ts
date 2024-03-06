import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArtistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;

  @ApiProperty()
  id?: string;
}

export class ArtistResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  grammy: boolean;

  @ApiProperty()
  id: string;
}
