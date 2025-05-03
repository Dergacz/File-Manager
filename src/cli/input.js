import readline from 'readline';
import { getCurrentDir } from '../paths/paths.js';
import { handleChangeDir, handleLs, handleUp } from '../navigations/navigations.js';

export function startCLI(username) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `You are currently in ${getCurrentDir()}> `,
  });

  rl.prompt();

  rl.on('line', async (input) => {
    const trimmedLine = input.trim();
    const [command, ...args] = trimmedLine.split(' ');

    switch (command) {
      case 'up':
        handleUp();
        break;
      case 'cd':
        await handleChangeDir(args.join(' '));
        break;
      case 'ls':
        await handleLs();
        break;
      case '.exit':
        rl.close();
        break;
      default:
        console.log(`Invalid input: ${command}`);
        break;
    }

    rl.setPrompt(`You are currently in ${getCurrentDir()}> `);
    rl.prompt();
  });

  rl.on('SIGINT', () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  });
}
