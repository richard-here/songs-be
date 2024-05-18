const songRepository = {
  create: (createSongDTO) => {
  },
};

class ArtistRepository {
  save(createArtistDTO) {
  }
};

describe('spyOn Demo', () => {
  afterEach(() => jest.resetAllMocks());

  it('should spyon the existing object', () => {
    const spy = jest.spyOn(songRepository, 'create');

    songRepository.create({ id: 1, title: 'Lover' });

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ id: 1, title: 'Lover' });
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    // spy.mockRestore();
  });

  it('should spy on the class method', () => {
    const artist = new ArtistRepository();
    const spy = jest
      .spyOn(artist, 'save')
      .mockImplementation((createArtistDTO) => createArtistDTO);
  
    artist.save({ name: 'Martin Garrix' });
    console.log(spy({ name: 'Martin Garrix' }));
  
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ name: 'Martin Garrix' });
  
    // spy.mockRestore();
  });
});
