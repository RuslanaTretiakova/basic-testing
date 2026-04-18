import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 1000);
    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);

    expect(setIntervalSpy).toHaveBeenCalledWith(callback, 1000);
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinMock = join as jest.Mock;
    joinMock.mockReturnValue('/mocked/path/file.txt');

    const existsSyncMock = existsSync as jest.Mock;
    existsSyncMock.mockReturnValue(false);

    await readFileAsynchronously('file.txt');

    expect(joinMock).toHaveBeenCalledWith(expect.any(String), 'file.txt');
  });

  test('should return null if file does not exist', async () => {
    const joinMock = join as jest.Mock;
    joinMock.mockReturnValue('/mocked/path/file.txt');

    const existsSyncMock = existsSync as jest.Mock;
    existsSyncMock.mockReturnValue(false);

    const result = await readFileAsynchronously('file.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const joinMock = join as jest.Mock;
    joinMock.mockReturnValue('/mocked/path/file.txt');

    const existsSyncMock = existsSync as jest.Mock;
    existsSyncMock.mockReturnValue(true);

    const readFileMock = readFile as jest.Mock;
    readFileMock.mockResolvedValue(Buffer.from('hello world'));

    const result = await readFileAsynchronously('file.txt');

    expect(result).toBe('hello world');
  });
});
