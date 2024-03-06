import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  HttpStatus,
  UsePipes,
  ParseUUIDPipe,
  Param,
  HttpCode,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArtistService } from './artist.service';
import { Artist } from './interfaces/artist.interface';
import { CommonNotFoundException } from 'src/exception/not-found.exception';
import { ArtistDto } from './dto/artist.dto';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  getArtists(): Artist[] {
    return this.artistService.getArtists();
  }

  @Get(':id')
  @UsePipes(ParseUUIDPipe)
  getArtist(@Param('id') id: string): Artist {
    const artist = this.artistService.findArtist(id);

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Body() artistDto: ArtistDto): Artist {
    const newArtist = this.artistService.createArtist(artistDto);
    return newArtist;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: ArtistDto,
  ): Artist {
    const artist = this.artistService.findArtist(id);

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    return this.artistService.updateArtist(artist, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  deleteArtist(@Param('id') id: string): string {
    const artist = this.artistService.findArtist(id);

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    this.artistService.deleteArtist(id);

    return `User with ID ${id} was deleted successfully`;
  }
}
