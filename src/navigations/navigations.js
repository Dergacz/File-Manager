import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import {setCurrentDir} from "../paths/paths.js";

export const handleUp = () => {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);

  if (parentDir === currentDir) {
    console.log('You are already in the root directory.');
    return;
  }

  process.chdir(parentDir);
  setCurrentDir(parentDir);
  console.log(`You are now in the directory: ${parentDir}`);
}

export const handleChangeDir = async (targetPath) => {
  console.log('changeeeee')
  if (!targetPath) {
    console.log('Please provide a directory name.');
    return;
  }

  const fullPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(process.cwd(), targetPath);

  try {
    const stats = await fs.stat(fullPath);
    if (!stats.isDirectory()) {
      console.log('Not a directory');
      return;
    }

    process.chdir(fullPath);
    setCurrentDir(fullPath);
    console.log(`You are now in the directory: ${fullPath}`);
  } catch (err) {
    console.error('Cannot change directory', err.message);
  }
}

export const handleLs = async () => {
  const cwd = process.cwd();

  try {
    const files = await fs.readdir(cwd, {withFileTypes: true});
    const sorted = [...files].sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
    console.log('Current directory contents:');
    console.table(
      sorted.map(entry => ({
        Name: entry.name,
        Type: entry.isDirectory() ? 'directory' : 'file',
      }))
    );
  } catch (err) {
    console.error('Cannot read directory', err.message);
  }
};
