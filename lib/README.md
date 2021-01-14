# About this tool

## When to use

Use this Node CLI tool when as a Metamask user, you are unable to cancel a transaction because they keep queing up.

This can also happen with file wallets that are used programatically, hence why I built this tool for myself in the first place.

## How does it work

It is quite simple and is the recommended solution to override a transaction that is unlikely to be confirmed given the allowed gas price. One of the main inputs is the nonce, which is pre-populated with the number of transactions confirmed by the account. This value can be overriden by the user for more control over the issue.

## Limitations

This tool doesn't support hardware wallets, and most likely won't in the future.

## TODO:

- Use logging library
- Configure `package.json` for symlink support
- Publish as npm package
- Add inquirer question for network selection (mainnet hardcoded atm)

# Using Ethers' _Sandbox Utility_

Personally, I built the tool for a nicer multi-step CLI experience, with the option of giving the password in a file. If you don't want to use `ethereum-cancel-tx`, you can use `ethers` utility directly. 

> from https://docs.ethers.io/v5/single-page/#/v5/cli/ethers/-%23-sandbox-utility--examples
The sandbox utility provides a simple way to use the most common ethers utilities required during learning, debugging and managing interactions with the Ethereum network.

```
Help
Usage:
   ethers [ COMMAND ] [ ARGS ] [ OPTIONS ]

COMMANDS (default: sandbox)
   sandbox                    Run a REPL VM environment with ethers
   init FILENAME              Create a new JSON wallet
      [ --force ]                Overwrite any existing files
   fund TARGET                Fund TARGET with testnet ether
   info [ TARGET ... ]        Dump info for accounts, addresses and ENS names
   send TARGET ETHER          Send ETHER ether to TARGET form accounts[0]
      [ --allow-zero ]           Allow sending to the address zero
      [ --data DATA ]            Include data in the transaction
   sweep TARGET               Send all ether from accounts[0] to TARGET
   (...)

ACCOUNT OPTIONS
  --account FILENAME          Load from a file (JSON, RAW or mnemonic)
  --account RAW_KEY           Use a private key (insecure *)
  --account 'MNEMONIC'        Use a mnemonic (insecure *)
  --account -                 Use secure entry for a raw key or mnemonic
  --account-void ADDRESS      Use an address as a void signer
  --account-void ENS_NAME     Add the resolved address as a void signer
  --account-rpc ADDRESS       Add the address from a JSON-RPC provider
  --account-rpc INDEX         Add the index from a JSON-RPC provider
  --mnemonic-password         Prompt for a password for mnemonics
  --xxx-mnemonic-password     Prompt for a (experimental) hard password

PROVIDER OPTIONS (default: all + homestead)
  --alchemy                   Include Alchemy
  --etherscan                 Include Etherscan
  --infura                    Include INFURA
  --nodesmith                 Include nodesmith
  --rpc URL                   Include a custom JSON-RPC
  --offline                   Dump signed transactions (no send)
  --network NETWORK           Network to connect to (default: homestead)

TRANSACTION OPTIONS (default: query network)
  --gasPrice GWEI             Default gas price for transactions(in wei)
  --gasLimit GAS              Default gas limit for transactions
  --nonce NONCE               Initial nonce for the first transaction
  --yes                       Always accept Signing and Sending

OTHER OPTIONS
  --wait                      Wait until transactions are mined
  --debug                     Show stack traces for errors
  --help                      Show this usage and exit
  --version                   Show this version and exit
```
(*) By including mnemonics or private keys on the command line they are
    possibly readable by other users on your system and may get stored in
    your bash history file. This is NOT recommended.

### Achieve the goal by sending 0 ether from your account to itself
Replace XXX with the nonce of the tx that is clogging your queue, and 0xYYYYYYYY with your own address
```bash
/home/ricmoo> ethers --account wallet.json --nonce XXX send 0xYYYYYYYY 0
Password (wallet.json): ******
Decrypting... 100%
Transaction:
  To:         0x8ba1f109551bD432803012645Ac136ddd64DBA72
  From:       0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C
  Value:      0.123 ether
  Nonce:      96
  Data:       0x
  Gas Limit:  21000
  Gas Price:  1.2 gwei
  Chain ID:   1
  Network:    homestead
Send Transaction? (y/N/a) y
Response:
  Hash:  0xc4adf8b379033d7ab679d199aa35e6ceee9a802ca5ab0656af067e911c4a589a

```