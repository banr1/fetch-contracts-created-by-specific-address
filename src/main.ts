import Web3 from "web3";

async function getDeployedContracts(deployerAddress: string): Promise<string[]> {
  const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFRA_API_KEY}`);

  const latestBlockNumber = await web3.eth.getBlockNumber();

  const deployedContracts: string[] = [];

  for (let blockNumber = latestBlockNumber; blockNumber >= 0; blockNumber--) {
    const block = await web3.eth.getBlock(blockNumber, true);

    for (const tx of block.transactions) {
      const from = typeof tx === 'string' ? tx : tx.from;
      if (from.toLowerCase() === deployerAddress.toLowerCase()) {
        const receipt = await web3.eth.getTransactionReceipt(typeof tx === 'string' ? tx : tx.hash);

        if (receipt.contractAddress) {
          deployedContracts.push(receipt.contractAddress);
        }
      }

      // Print progress
      if (blockNumber % BigInt(100) === BigInt(0)) {
        console.log(`Scanning block ${blockNumber}...`);
      }

      // Stop scanning if we have reached the block that UniSwapX was called for the first time
      if (blockNumber === BigInt(17782978)) {
        break;
      }
    }
  }

  return deployedContracts;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.log("You must pass exactly one wallet address as an argument.");
    process.exit(1);
  }

  const walletAddress = args[0];
  console.log(`Fetching all contract addresses for wallet: ${walletAddress}`);

  getDeployedContracts(walletAddress)
    .then((contracts) => {
      console.log('Deployed contracts:', contracts);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

main();
