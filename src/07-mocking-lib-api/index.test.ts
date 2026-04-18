import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn: (...args: unknown[]) => unknown) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });
  });

  test('should create instance with provided base url', async () => {
    mockGet.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi('/posts');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockGet.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi('/posts');

    expect(mockGet).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    const mockData = [{ id: 1, title: 'Test post' }];
    mockGet.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi('/posts');

    expect(result).toEqual(mockData);
  });
});
