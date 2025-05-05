import {createReadStream, createWriteStream} from 'node:fs';
import {stat, writeFile, mkdir, unlink, rename} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {getCurrentDir} from "../paths/paths.js";

export const handleCat = async (filePath) => {
  if (!filePath) {
    console.log('Please provide a file path.');
    return;
  }

  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  const data = [];

  try {
    const stats = await stat(fullPath);
    if (!stats.isFile()) {
      console.log('Not a file');
      return;
    }

    const readStream = createReadStream(fullPath, {encoding: 'utf-8'});
    readStream
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', () => {
        process.stdout.write(data.join('') + '\n');
      })
      .on('error', (err) => {
        console.error('Error reading file:', err.message);
      });

  } catch (err) {
    console.error('Cannot read a file', err.message);
  }
}

export const handleAdd = async (fileName) => {
  const dirname = getCurrentDir();
  const filePath = path.join(dirname, fileName);

  try {
    await writeFile(filePath, '', {flag: 'wx'});
    console.log(`File created: ${filePath}`);
  } catch (err) {
    console.log('Cannot create file', err.message);
  }
}

export const handleMkdir = async (dirname) => {
  try {
    await mkdir(dirname);
    console.log(`Directory created: ${dirname}`);
  } catch (err) {
    console.log('Cannot create directory', err.message);
  }
}

export const handleRn = async (filePath, fileName) => {
  if (!filePath || !fileName) {
    console.log('Please provide a file path and new file name.');
    return;
  }

  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  try {
    await stat(fullPath);
    const newFileName = path.join(path.dirname(fullPath), fileName);
    if (newFileName === fullPath) {
      console.log('File name is the same');
      return;
    }
    await rename(fullPath, newFileName);
    console.log(`File renamed: ${newFileName}`);
  } catch (err) {
    console.error('Operation failed', err.message);
  }
}

export const handleCp = async (currentPath, newPath) => {
  if (!currentPath || !newPath) {
    console.log('Please provide a current file path and new file path.');
    return;
  }

  const currentFullPath = path.isAbsolute(currentPath)
    ? currentPath
    : path.resolve(process.cwd(), currentPath);

  const newFullPath = path.isAbsolute(newPath)
    ? newPath
    : path.resolve(process.cwd(), newPath);

  try {
    const sourceStat = await stat(currentFullPath);
    if (!sourceStat.isFile()) {
      console.log('Not a file');
      return;
    }

    const destStat = await stat(newFullPath);
    if (!destStat.isDirectory()) {
      console.log('Directory does not exist');
      return;
    }

    const fileName = path.basename(currentFullPath);
    const destFilePath = path.join(newFullPath, fileName);

    const readStream = createReadStream(currentFullPath);
    const writeStream = createWriteStream(destFilePath);

    readStream
      .pipe(writeStream)
      .on('error', (err) => {
        console.error('Error reading file:', err.message);
      });

    writeStream
      .on('finish', () => {
        console.log('File successfully copied to:', destFilePath);
      })
      .on('error', (err) => {
        console.error('Error writing file:', err.message);
      });
  } catch (err) {
    console.error('Error:', err.message);
  }
};

export const handleMv = async (currentPath, newPath) => {
  if (!currentPath || !newPath) {
    console.log('Please provide a current file path and new file path.');
    return;
  }

  const currentFullPath = path.isAbsolute(currentPath)
    ? currentPath
    : path.resolve(process.cwd(), currentPath);

  const newFullPath = path.isAbsolute(newPath)
    ? newPath
    : path.resolve(process.cwd(), newPath);

  try {
    const sourceStat = await stat(currentFullPath);
    if (!sourceStat.isFile()) {
      console.log('Not a file');
      return;
    }

    const destStat = await stat(newFullPath);
    if (!destStat.isDirectory()) {
      console.log('Directory does not exist');
      return;
    }

    const fileName = path.basename(currentFullPath);
    const destFilePath = path.join(newFullPath, fileName);

    const readStream = createReadStream(currentFullPath);
    const writeStream = createWriteStream(destFilePath);

    readStream
      .pipe(writeStream)
      .on('error', (err) => {
        console.error('Error reading file:', err.message);
      });

    writeStream
      .on('finish', async () => {
        try {
          await unlink(currentFullPath);
          console.log('File successfully moved to:', destFilePath);
        } catch (err) {
          console.error('Error deleting original file:', err.message);
        }
      })
      .on('error', (err) => {
        console.error('Error writing file:', err.message);
      });
  } catch (err) {
    console.error('Error:', err.message);
  }
};

export const handleRm = async (filePath) => {
  if (!filePath) {
    console.log('Please provide a file name.');
    return;
  }

  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  try {
    await stat(fullPath);
    await unlink(fullPath);
    console.log(`File removed: ${fullPath}`);
  } catch (err) {
    console.error('Operation failed', err.message);
  }
}
