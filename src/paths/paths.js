let currentDir = process.cwd();

export const getCurrentDir = () => {
  return currentDir;
}

export const setCurrentDir = (newDir) => {
  currentDir = newDir;
}
