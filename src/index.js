#!/usr/bin/env node

import { startCLI } from './cli/input.js';

const username = process.argv.find(arg => arg.startsWith('--username='))?.split('=')[1] || 'Anonymous';

console.log(`Welcome to the File Manager, ${username}!\n`);
startCLI(username);
