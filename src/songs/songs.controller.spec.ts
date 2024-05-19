import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { ArtistsService } from '../artists/artists.service';
import { Song } from './song.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Artist } from '../artists/artist.entity';

describe('SongsService', () => {
  let service: SongsService;
  let repo: Repository<Song>;
  let artistsService: ArtistsService;

  const date = new Date();
  const oneSong = { id: 1, title: 'Lover', artists: [1], duration: date, lyrics: 'Lyrics', releasedDate: date };
  const songArray = [{ id: 1, title: 'Lover', artists: [1], duration: date, lyrics: 'Lyrics', releasedDate: date }];
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        ArtistsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest
              .fn()
              .mockImplementation(() => Promise.resolve(songArray)),
            findOneBy: jest
              .fn()
              .mockImplementation((options: FindOneOptions<Song>) => {
                return Promise.resolve(oneSong);
              }),
            create: jest
              .fn()
              .mockImplementation((createSongDTO: CreateSongDTO) => {
                return Promise.resolve(oneSong);
              }),
            save: jest
              .fn()
              .mockImplementation((createSongDTO: CreateSongDTO) => {
                return Promise.resolve(oneSong);
              }),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateSongDTO: UpdateSongDTO) => {
                  return Promise.resolve({ affected: 1 });
                },
              ),
            delete: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ affected: 1 }),
              ),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findBy: jest.fn().mockResolvedValue({ id: 1, name: 'Taylor Swift' }),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    artistsService = module.get<ArtistsService>(ArtistsService);
    repo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should give me the song by id', async () => {
    const song = await service.findOne(1);
    const repoSpy = jest.spyOn(repo, 'findOneBy');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should create the song', async () => {
    const song = await service.create({ title: 'Lover', artists: [1], duration: date, lyrics: 'Lyrics', releasedDate: date });
    expect(song).toEqual({ id: 1, title: 'Lover', artists: [1], duration: date, lyrics: 'Lyrics', releasedDate: date});
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({ title: 'Lover', artists: { id: 1, name: 'Taylor Swift' }, duration: date, lyrics: 'Lyrics', releasedDate: date });
  });

  it('should update the song', async () => {
    const result = await service.update(1, { title: 'Lover', artists: [1], duration: date, lyrics: 'Lyrics', releasedDate: date });
    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(result.affected).toEqual(1);
  });

  it('should delete the song', async () => {
    const song = await service.remove(1);
    const repoSpyOn = jest.spyOn(repo, 'delete');
    expect(repo.delete).toHaveBeenCalledTimes(1);
    expect(song.affected).toBe(1);
    expect(repoSpyOn).toHaveBeenCalledWith(1);
  });
});