import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Song } from './song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  create(@Body() createSongDTO: CreateSongDTO) : Promise<Song> {
    return this.songsService.create(createSongDTO);
  }

  @Get()
  findAll() : Promise<Song[]> {
    return this.songsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) : Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe)
    @Body() updateSongDTO: UpdateSongDTO,
    id: number,
  ) : Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }
  
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe)
    id: number,
  ) : Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
}
