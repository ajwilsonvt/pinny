#!/usr/bin/env node

// This file contains the main entry point for the command line `pinny` app, and the command line option parsing code.
// See pinny.js for the core functionality.

const path = require('path')
const {Command} = require('commander')
const chalk = require('chalk')
const {MakePinny} = require('./pinny')

async function main() {
    const program = new Command()
    
    // commands
    program
        .command('ipfs-pin-metadata <metadata-path>')
        .description('generate NFT metadata on IPFS and pin')
        .action(generateIPFSMetadataAndPin)


    // The hardhat and getconfig modules both expect to be running from the root directory of the project,
    // so we change the current directory to the parent dir of this script file to make things work
    // even if you call minty from elsewhere
    const rootDir = path.join(__dirname, '..')
    process.chdir(rootDir)

    await program.parseAsync(process.argv)
}

// ---- command action functions


async function generateIPFSMetadataAndPin(metadataPath) {
    const pinny = await MakePinny()
    const cid = await pinny.uploadMetadataFolderToIPFS(metadataPath);
    console.log('🌿 Created new NFT data on IPFS: '+chalk.blue("ipfs://"+cid));
}

// ---- helpers

// ---- main entry point when running as a script

// make sure we catch all errors
main().then(() => {
    process.exit(0)
}).catch(err => {
    console.error(err)
    process.exit(1)
})
