import os from 'node:os';

export const handleOSInfo = (flag) => {
  switch (flag) {
    case '--EOL':
      console.log(`EOL: ${JSON.stringify(os.EOL)}`);
      break;
    case '--cpus':
      const cpus = os.cpus();
      cpus.forEach((cpu, index) => {
        const { model, speed } = cpu;
        console.log(`CPU ${index + 1}:`);
        console.log(`        Model : ${model}`);
        console.log(`        Clock rate : ${(speed / 1000).toFixed(2)} GHz\n`);
      });
      break;
    case '--homedir':
      console.log(`Home directory: ${os.homedir()}`);
      break;
    case '--username':
      console.log(`User name: ${os.userInfo().username}`);
      break;
    case '--architecture':
      console.log(`System architecture: ${os.arch()}`);
      break;
    default:
      console.log('Invalid flag');
  }
}
