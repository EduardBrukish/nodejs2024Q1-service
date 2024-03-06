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
import { TrackService } from './track.service';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { TrackDto, TrackResponseDto } from './dto/track.dto';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiOkResponse({ type: [TrackResponseDto] })
  getTracks(): TrackResponseDto[] {
    return this.trackService.getTracks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiOkResponse({ type: TrackResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  getTrack(@Param('id') id: string): TrackResponseDto {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The track has been successfully created.',
    type: TrackResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() trackDto: TrackDto): TrackResponseDto {
    const newTrack = this.trackService.createTrack(trackDto);

    return newTrack;
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The track data has been successfully updated.',
    type: TrackResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found' })
  @UsePipes(new ValidationPipe())
  updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() trackDto: TrackDto,
  ): TrackResponseDto {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    return this.trackService.updateTrack(track, trackDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Track with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  deleteTrack(@Param('id') id: string): string {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    this.trackService.deleteTrack(id);

    return `Track with ID ${id} was deleted successfully`;
  }
}
