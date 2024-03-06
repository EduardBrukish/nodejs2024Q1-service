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
import {
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { AlbumDto, AlbumResponseDto } from './dto/album.dto';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiOkResponse({ type: [AlbumResponseDto] })
  getAlbums(): AlbumResponseDto[] {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiOkResponse({ type: AlbumResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Album with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  getAlbum(@Param('id') id: string): AlbumResponseDto {
    const album = this.albumService.findAlbum(id);

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The artist has been successfully created.',
    type: AlbumResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() albumDto: AlbumDto): AlbumResponseDto {
    const newAlbum = this.albumService.createAlbum(albumDto);

    return newAlbum;
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The album data has been successfully updated.',
    type: AlbumResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Album with ID ${id} not found' })
  @UsePipes(new ValidationPipe())
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() albumDto: AlbumDto,
  ): AlbumResponseDto {
    const album = this.albumService.findAlbum(id);

    if (!album) {
      throw new CommonNotFoundException(`Album with ID ${id} not found`);
    }

    return this.albumService.updateAlbum(album, albumDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Album with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Album with ID ${id} not found' })
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
