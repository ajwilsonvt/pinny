const fsp = require('fs/promises');
const fs = require('fs');
const config = require('getconfig');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(config.pinningService.apiKey, config.pinningService.secretApiKey);


const ipfsAddOptions = {pinataOptions: {
    cidVersion: 1,
    customPinPolicy: {
        regions: [
            {
                id: 'FRA1',
                desiredReplicationCount: 2
            },
            {
                id: 'NYC1',
                desiredReplicationCount: 2
            }
        ]
    } }
}
const ipfsAddOptionsWrapDirectory = {
    cidVersion: 1,
    wrapWithDirectory: true
}

/**
 * Construct and asynchronously initialize a new Minty instance.
 * @returns {Promise<Pinny>} a new instance of Minty, ready to mint NFTs.
 */
async function MakePinny() {
    const m = new Pinny()
    await m.init()
    return m
}

class Pinny {
    constructor() {
        this._initialized = false
        this.pinata = null;
        this.folderName = null;
    }


    async init() {
        if (this._initialized) {
            return
        }
        // create a local IPFS node
        this.pinata = pinata;

        this._initialized = true
    }

    async uploadMetadataFolderToIPFS(folder) {
        const folderParts = folder.split("/");
        this.folderName = folderParts[folderParts.length - 1];
        const metadataFile = await fsp.readFile(folder + "/metadata.json", "utf-8");
        const metadataList = JSON.parse(metadataFile);
        const metadataArray = [];
        const total = metadataList.length;
        var index = 1;
        for (let item in metadataList) {
            const metadata = await this.addImageToMetadata(metadataList[item], folder, index, total);
            await fsp.mkdir("./output"+metadata.path, {recursive: true}).then(x => fsp.writeFile("./output"+metadata.filename, JSON.stringify(metadata.content)));
            metadataArray.push(metadata);
            index = index + 1;
        }
        return await this.pinJson("./output/"+this.folderName, this.folderName, 500);
    }


    async uploadImageToIPFS(index, total, folder, imagePath) {
        const image = fs.createReadStream(folder + "/" + imagePath);
        const cid = await this.pinFile(index, total, image, 500);
        return cid;
    }

    async addImageToMetadata(content, folder, index, total) {
        const imagePath = content['image'];
        const imageCid = await this.uploadImageToIPFS(index, total, folder, imagePath);
        content['image'] = "ipfs://" + imageCid;
        content['external_url'] = config.websiteURL + "/" + this.folderName + "/" + index;
        const metadata = {filename: "/" + this.folderName + "/" + index, path: "/" + this.folderName,  content};
        return metadata;
    }

    async pinFile(index, total, file, timeout) {
            await this.timeout(timeout);
           return await this.pinata.pinFileToIPFS(file,ipfsAddOptions).then((result) => {
                console.log("Image "+ index + "/" + total + " 📍 " +result.IpfsHash + " succesfully pinned!");
                return result.IpfsHash;
            }).catch(async (e) => {
                console.log(e);
                console.log("⌛ file not yet pinned. Polling again in " + timeout * 2 + " seconds...");
                return await this.pin(index, total, file, timeout * 2);
            })
    }

    async pinJson(file, filename, timeout) {
        await this.timeout(timeout);
        const options = {
            pinataMetadata: {
                name: filename
            },
            pinataOptions: ipfsAddOptionsWrapDirectory
        }
        return await this.pinata.pinFromFS(file,options).then((result) => {
            console.log("Metadata 📍 " +result.IpfsHash + " succesfully pinned!");
            return result.IpfsHash;
        }).catch(async (e) => {
            console.log(e);
            console.log("⌛ file not yet pinned. Polling again in " + timeout * 2 + " seconds...");
            return await this.pinJson(file, filename, timeout * 2);
        })
    }


    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}



module.exports = {
    MakePinny,
}