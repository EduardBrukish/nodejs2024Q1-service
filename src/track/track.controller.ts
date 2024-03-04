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
import { TrackService } from './track.service';
import { Track } from './interfaces/track.interface';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { TrackDto } from './dto/track.dto';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  getTracks(): Track[] {
    return this.trackService.getTracks();
  }

  @Get(':id')
  @UsePipes(ParseUUIDPipe)
  getTrack(@Param('id') id: string): Track {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() trackDto: TrackDto): Track {
    const newTrack = this.trackService.createTrack(trackDto);

    return newTrack;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() trackDto: TrackDto,
  ): Track {
    const track = this.trackService.findTrack(id);

    if (!track) {
      throw new CommonNotFoundException(`Track with ID ${id} not found`);
    }

    return this.trackService.updateTrack(track, trackDto);
  }

  @Delete(':id')
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
