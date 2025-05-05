import readline from 'readline';
import {getCurrentDir} from '../paths/paths.js';
import {handleChangeDir, handleLs, handleUp} from '../navigations/navigations.js';
import {handleAdd, handleCat, handleCp, handleMkdir, handleMv, handleRm, handleRn} from "../files/files.js";
import {handleOSInfo} from "../osInfo/osInfo.js";
import {handleHash} from "../hash/hash.js";
import {handleCompress, handleDecompress} from "../zip/zip.js";
import {exitHandler} from "../utils/exitHandler.js";

export const startCLI = (username) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `You are currently in ${getCurrentDir()}> `,
  });

  rl.prompt();

  rl.on('line', async (input) => {
    const trimmedLine = input.trim();
    const [command, ...args] = trimmedLine.split(' ');
    const argument = args.join(' ');

    switch (command) {
      case 'up':
        handleUp();
        break;
      case 'cd':
        await handleChangeDir(argument);
        break;
      case 'ls':
        await handleLs();
        break;
      case 'cat':
        await handleCat(argument);
        break;
      case 'add':
        await handleAdd(argument);
        break;
      case 'mkdir':
        await handleMkdir(argument);
        break
      case 'rn':
        const [path, newName] = argument.split(' ');
        await handleRn(path, newName);
        break
      case 'cp': {
        const [currentPath, newPath] = argument.split(' ');
        await handleCp(currentPath, newPath);
        break
      }
      case 'mv': {
        const [currentPath, newPath] = argument.split(' ');
        await handleMv(currentPath, newPath);
        break
      }
      case 'rm':
        await handleRm(argument);
        break;
      case 'os':
        await handleOSInfo(argument);
        break;
      case 'hash':
        await handleHash(argument);
        break;
      case 'compress': {
        const [currentPath, newPath] = argument.split(' ');
        await handleCompress(currentPath, newPath);
        break;
      }
      case 'decompress': {
        const [currentPath, newPath] = argument.split(' ');
        await handleDecompress(currentPath, newPath);
        break;
      }
      case '.exit':
        exitHandler(username);
        break;
      default:
        console.log(`Invalid input: ${command}`);
        break;
    }

    rl.setPrompt(`You are currently in ${getCurrentDir()}> `);
    rl.prompt();
  });

  rl.on('SIGINT', () => {
    exitHandler(username);
  });
}
