import {createReadStream, createWriteStream} from 'node:fs';
import {createBrotliCompress, createBrotliDecompress} from 'node:zlib';
import {stat} from 'node:fs/promises';
import path from 'node:path';

export const handleCompress = async (file, destinationPath) => {
  if (!file || !destinationPath) {
    console.log('Please provide a file name amd destination path.');
    return;
  }

  const fullPath = path.isAbsolute(file)
    ? file
    : path.resolve(process.cwd(), file);

  const destFullPath = path.isAbsolute(destinationPath)
    ? destinationPath
    : path.resolve(process.cwd(), destinationPath);

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      console.log('Not a file');
      return;
    }
    const readStream = createReadStream(fullPath);
    const zip = createBrotliCompress();
    const writeStream = createWriteStream(destFullPath);

    readStream
      .pipe(zip)
      .pipe(writeStream)
      .on('finish', () => {
        process.stdout.write('File successfully compressed\n');
      })
      .on('error', (err) => {
        console.error('Error compressing file:', err.message);
      });
  } catch (err) {
    console.error('Cannot compress file', err.message);
  }
}

export const handleDecompress = async (file, destinationPath) => {
  if (!file || !destinationPath) {
    console.log('Please provide a file name amd destination path.');
    return;
  }

  const fullPath = path.isAbsolute(file)
    ? file
    : path.resolve(process.cwd(), file);

  const destFullPath = path.isAbsolute(destinationPath)
    ? destinationPath
    : path.resolve(process.cwd(), destinationPath);

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      console.log('Not a file');
      return;
    }
    const readStream = createReadStream(fullPath);
    const unzip = createBrotliDecompress();
    const writeStream = createWriteStream(destFullPath);

    readStream
      .pipe(unzip)
      .pipe(writeStream)
      .on('finish', () => {
        process.stdout.write('File successfully decompressed\n');
      })
      .on('error', (err) => {
        console.error('Error decompressing file:', err.message);
      });
  } catch (err) {
    console.error('Cannot decompress file', err.message);
  }
}
