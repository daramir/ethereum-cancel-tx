#!/usr/bin/env node
'use strict';

const { ethers } = require('ethers');
const BN = require('bn.js');
const got = require('got');
const cheerio = require('cheerio');


const findLatestNonceForAddress = async (provider, address) => {
  return provider.getTransactionCount(address)
};

const getGasPrice = async () => {
  let response;
  let price = null;

  try {
    response = await got('https://ethgasstation.info');
    const $ = cheerio.load(response.body);
    price = new BN($('.count.standard').text()); //price in Gwei
    price = price.mul(new BN(10).pow(new BN(9))); //convert to wei
  } catch (error) {
    console.error(error);
    return price;
  }
  console.log(`gasPriceClean: ${price}`);

  return price;
};

const getInfuraProvider = () => {
  return new ethers.providers.InfuraProvider('homestead');
};

const connectWalletInfura = async (jsonWallet, walletPassword) => {
  const ethersWallet = await new ethers.Wallet.fromEncryptedJson(
    jsonWallet,
    walletPassword,
  );
  const ip = getInfuraProvider();
  let wallet = ethersWallet.connect(ip);
  return { wallet, ip };
};

async function clearTxns(connectedEthersWallet, manualishNonce) {
  let wallet = connectedEthersWallet;

  const txRequest = {
    to: connectedEthersWallet.address,
    from: connectedEthersWallet.address,
    gasPrice: ethers.BigNumber.from((await getGasPrice()).toString()),
    gasLimit: 21000, // enough gas for this tx
    value: 0, 
    nonce: manualishNonce,
    chainId: connectedEthersWallet.provider.network.chainId,
  };
  let txResponse = await wallet.sendTransaction(txRequest);
  const confirmed = await txResponse.wait();

  return confirmed;
}

module.exports = {
  connectWalletInfura,
  findLatestNonceForAddress,
  clearTxns,
  getInfuraProvider
};
