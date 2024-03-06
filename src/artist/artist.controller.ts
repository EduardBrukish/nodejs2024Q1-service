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
import { ArtistService } from './artist.service';
import { Artist } from './interfaces/artist.interface';
import { CommonNotFoundException } from 'src/exception/not-found.exception';
import { ArtistDto, ArtistResponseDto } from './dto/artist.dto';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiOkResponse({ type: [ArtistResponseDto] })
  getArtists(): ArtistResponseDto[] {
    return this.artistService.getArtists();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: ArtistResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  getArtist(@Param('id') id: string): ArtistResponseDto {
    const artist = this.artistService.findArtist(id);

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The artist has been successfully created.',
    type: ArtistResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  createArtist(@Body() artistDto: ArtistDto): ArtistResponseDto {
    const newArtist = this.artistService.createArtist(artistDto);
    return newArtist;
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The artist data has been successfully updated.',
    type: ArtistResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found' })
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
  @ApiNoContentResponse({
    description: 'Artist with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  deleteArtist(@Param('id') id: string): string {
    const artist = this.artistService.findArtist(id);

    if (!artist) {
      throw new CommonNotFoundException(`Artist with ID ${id} not found`);
    }

    this.artistService.deleteArtist(id);

    return `Artist with ID ${id} was deleted successfully`;
  }
}
