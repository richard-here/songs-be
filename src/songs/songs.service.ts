import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }

  create(songDTO: CreateSongDTO) : Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.releasedDate = songDTO.releasedDate;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    return this.songsRepository.save(song);
  }

  findAll() : Promise<Song[]> {
    return this.songsRepository.find();
  }

  findOne(id: number) : Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  remove(id: number) : Promise<DeleteResult> {
    return this.songsRepository.delete(id);
  }

  update(id: number, recordToUpdate: UpdateSongDTO) : Promise<UpdateResult> {
    return this.songsRepository.update(id, recordToUpdate);
  }
}
