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
import { AlbumService } from './album.service';
import { Album } from './interfaces/album.interface';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { AlbumDto } from './dto/album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAlbums(): Album[] {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  @UsePipes(ParseUUIDPipe)
  getAlbum(@Param('id') id: string): Album {
    const album = this.albumService.findAlbum(id);

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() albumDto: AlbumDto): Album {
    const newAlbum = this.albumService.createAlbum(albumDto);

    return newAlbum;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() albumDto: AlbumDto,
  ): Album {
    const album = this.albumService.findAlbum(id);

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    return this.albumService.updateAlbum(album, albumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  deleteAlbum(@Param('id') id: string): string {
    const album = this.albumService.findAlbum(id);

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    this.albumService.deleteAlbum(id);

    return `Album with ID ${id} was deleted successfully`;
  }
}
