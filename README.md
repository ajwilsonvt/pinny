# Pinny: NFT Metadata Pinner for IPFS

Pinny is a tool to store non-fungible tokens (NFTs) metadata on IPFS using the [Pinata](https://pinata.cloud) pinning service.

## Usage

Run `pinny help` to see full usage instructions or `pinny help <command>` for help on a specific command: 

```shell
pinny help ipfs-pin-metadata  

Usage: pinny ipfs-pin-metadata [options] <metadata-path>

generate NFT metadata on IPFS and pin

Options:
  -h, --help  display help for command
```

## Setup 

To install and run Pinny, you must have NPM installed. Windows is not currently supported.

1. Clone this repository and move into the `pinny` directory:

    ```shell
    git clone https://github.com/the-n-project/pinny
    cd pinny
    ```

1. Install the NPM dependencies:

    ```shell
    npm install
    ```

1. Add the `pinny` command to your `$PATH`. This makes it easier to run Pinny from anywhere on your computer:

    ```
    npm link
    ```

## Pin NFT metadata

Pinning NFT metadata on IPFS can be done by running the `pinny ipfs-pin-metadata <path-to-nft-metadata>`. 
The folder requires a metadata.json file containing a list of NFT metadata objects that should be stored on IPFS. 
Images can be used and should be stored in a separate `images` folder.

```shell
pinny ipfs-pin-metadata ./nft-metadata/football    

Image 1/3 📍 bafkreicuiu7awj37bkptcqxk2u7qfzoicro5urwbjvepm2cces2vevm4cy succesfully pinned!
Image 2/3 📍 bafkreiassd6njev323vo3iuqizt7shj3xkxziklgwccg2vczd225yrbxau succesfully pinned!
Image 3/3 📍 bafkreig65s2l5iit4xz4u5da7tw6i4dbikgyz44qbaxqffkncdxhmns2oe succesfully pinned!
Metadata 📍 bafybeiehy4vbxgndy4gcpehzquk5jej4dcs2k3em2txioj47xmsinpj4i4 succesfully pinned!
🌿 Created new NFT data on IPFS: ipfs://bafybeiehy4vbxgndy4gcpehzquk5jej4dcs2k3em2txioj47xmsinpj4i4

```

## Configuration

Configuration are stored in [`./config/default.js`](./config/default.js).

