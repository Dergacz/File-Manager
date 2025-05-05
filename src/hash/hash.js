import path from "node:path";
import process from "node:process";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createHash } from "node:crypto";

export const handleHash = async (filePath) => {
  if (!filePath) {
    console.log('Please provide a file name.');
    return;
  }

  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      console.log('Not a file');
      return;
    }
    const readStream = createReadStream(fullPath);
    const hash = createHash('sha256');

    readStream
      .on('data', (chunk) => {
        hash.update(chunk);
      })
      .on('end', () => {
        process.stdout.write(hash.digest('hex') + '\n');
      });
  } catch (err) {
    console.error('Cannot calculate hash', err.message);
  }
}
