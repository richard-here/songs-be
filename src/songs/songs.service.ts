import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }

  async create(songDTO: CreateSongDTO) : Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.releasedDate = songDTO.releasedDate;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    // Find all artists based on IDs
    const artists = await this.artistsRepository.findBy({ id: In(songDTO.artists)})
    // Set the relation with artists and songs
    song.artists = artists;
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

  async update(id: number, recordToUpdate: UpdateSongDTO) : Promise<UpdateResult> {
    const updateData = new Song();
    updateData.title = recordToUpdate.title;
    updateData.releasedDate = recordToUpdate.releasedDate;
    updateData.duration = recordToUpdate.duration;
    updateData.lyrics = recordToUpdate.lyrics;
    updateData.releasedDate = recordToUpdate.releasedDate;

    const artists = await this.artistsRepository.findBy({ id: In(recordToUpdate.artists)});
    updateData.artists = artists;
    return this.songsRepository.update(id, updateData);
  }
}
