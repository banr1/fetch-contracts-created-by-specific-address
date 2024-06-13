const args = process.argv.slice(2);

if (args.length !== 1) {
  console.log("You must pass exactly one wallet address as an argument.");
  process.exit(1);
}

function processArguments(args: string[]) {
  const walletAddress = args[0];
  console.log(`Fetching all contract addresses for wallet: ${walletAddress}`);
}

processArguments(args);
