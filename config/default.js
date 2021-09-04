const { pinataApiKey, pinataSecretApiKey } = require('../secrets.json')

const config = {

    // The pinningService config tells minty what remote pinning service to use for pinning the IPFS data for a token.
    // The values are read in from environment variables, to discourage checking credentials into source control.
    // You can make things easy by creating a .env file with your environment variable definitions. See the example files
    // pinata.env.example and nft.storage.env.example in this directory for templates you can use to get up and running.
   pinningService: {
        apiKey : pinataApiKey,
        secretApiKey: pinataSecretApiKey
    },
    websiteURL: "https://the-n-project.io"

}

module.exports = config