describe('Mock function example', () => {
  it('should create a basic mock function', () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue(3);
    console.log(mockFn());
    expect(mockFn()).toBe(3);
    expect(mockFn.mock.calls.length).toBe(2);
    expect(mockFn).toHaveBeenCalled();
  });

  it('should create a mock function with argument', () => {
    const createSongMock = jest.fn((createSongDTO) => ({
      id: 1,
      title: createSongDTO.title,
    }));

    console.log(createSongMock({ title: 'Lover' }));
    expect(createSongMock).toHaveBeenCalled();
    expect(createSongMock({ title: 'Lover' })).toEqual({ id: 1, title: 'Lover' });
  });

  it('create mock function using mockImplementation', () => {
    const mockFn = jest.fn();
    mockFn.mockImplementation(() => {
      console.log('Mock function called');
    });

    mockFn();
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith();
  });

  it('it should create a mock function with promise', () => {
    const mockFetchSongs = jest.fn();
    mockFetchSongs.mockResolvedValue({ id: 1, title: 'Dancing Feat' });
    
    mockFetchSongs().then((result) => {
      console.log(result);
    });

    expect(mockFetchSongs).toHaveBeenCalled();
    expect(mockFetchSongs()).resolves.toEqual({ id: 1, title: 'Dancing Feat' });
  });
});