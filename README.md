# NFT MINTER SERVICE
Mint NFT with metadata through Message Queuing Protocol.

## Before running
This service was made to work with [this contract](https://github.com/anarkrypto/nft-minter/blob/main/contracts/NFT.sol) - it implements ERC-1155 functions.

** Enviroments:
- For testing it is recommended to use a testnet RPC and address your contract deployed in the same testnet network
- Add mainnet network and contract for production only

### Install lib dependencies:
```bash
yarn install
```

### Building:
```bash
yarn build
```

### Set env
```# Create your .env:
cp .env.example .env
```
Then updates your enviroments for tests or production

### Testing with mocha:
```bash
yarn test
```

### Deploy to a container with RabbitMQ:
```bash
docker-compose up
```

### Publishing to RabbitMQ (test):
Open a new terminal and publish a message to 
```bash
yarn test-publish
```

### Customize your handler/callback

You can implement your own callbacks by editing the code in [/src/custom/handler.ts](https://github.com/anarkrypto/nft-minter-service/blob/main/src/custom/handler.ts). This is useful if you want to save the result in a database, transmit in another queue, etc.

**onSuccess**: Function triggered after success. 
```
  {
    tokenId: 1,
    hash: "0xdb0cbfde7d9b48c0e1922c9eab130f5443bbd753ff27547730a3bab6cf5a2279"
   }
```

**onError**: Function triggered after some unknown error.
 
