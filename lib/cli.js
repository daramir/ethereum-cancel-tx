#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const {
  getInfuraProvider,
  connectWalletInfura,
  findLatestNonceForAddress,
  clearTxns,
} = require('../index');

const loadProgramArgs = async () => {
  const argv = yargs(hideBin(process.argv))
    .options({
      address: {
        alias: 'a',
        type: 'string',
        description: 'Address with low gas tx in queue',
      },
      walletPath: {
        alias: 'w',
        type: 'string',
        description: 'Path to encrypted JSON wallet file',
      },
      passwordPath: {
        alias: 'p',
        type: 'string',
        description: 'Path to clear text file with wallet password',
      },
    })
    .demandOption(
      ['walletPath'],
      'Please provide at least the json wallet file as an argument to work with this tool.',
    ).argv;

  return argv;
};

const readPasswordFromFile = (passwordPath) => {
  try {
    const jsonWallet = fs.readFileSync(passwordPath, 'utf8');
    return jsonWallet.trimEnd();
  } catch (error) {
    console.log(error.message);
    console.log(`Gracefully handled, continuing...`);
    return null;
  }
};

const requestInquirerInput = async (provider, address, passwordPath = null) => {
  return inquirer.prompt([
    {
      type: 'password',
      name: 'walletPassword',
      message: `What is the password for the wallet? (No -p param or file not found)`,
      when: () => passwordPath == null,
    },
    {
      type: 'number',
      name: 'nonce',
      message: 'What is the nonce of the tx clogging you wallet?',
      default: await findLatestNonceForAddress(provider, address),
    },
  ]);
};

async function main() {
  let args = await loadProgramArgs();
  const pathToWallet = path.resolve(process.cwd(), args.walletPath);
  const jsonWallet = fs.readFileSync(pathToWallet, 'utf8');

  const walletPass = readPasswordFromFile(args.p);

  const requiredInput = await requestInquirerInput(
    getInfuraProvider(),
    JSON.parse(jsonWallet).address,
    walletPass,
  );

  const { wallet: ethersWallet, ip: provider } = await connectWalletInfura(
    jsonWallet,
    walletPass || requiredInput.walletPassword,
  );

  console.log(await clearTxns(ethersWallet, requiredInput.nonce));
}

main().catch((err) => {
  console.error(err);
});