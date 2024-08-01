
export const Networks = {
    "arbitrum-sepolia": {
      id: "arbitrum-sepolia",
      derivation: "m/44'/60'/0'/",
      name: "Arbitrum Sepolia",
      provider: "https://arb-sepolia.g.alchemy.com/v2/UXh8_WqweCDab5HcGLSzAvq61poyqp_8", // Arbitrum Sepolia RPC endpoint
      prefix: "0x",
      summary: "Arbitrum Sepolia is a testnet chain replicating the capabilities of Arbitrum One's main network, linked to the Sepolia testnet.",
      website: "https://arbitrum.foundation/",
      coingecko: "https://www.coingecko.com/en/coins/arbitrum",
      net: "sepolia"
    },
    "ethereum-sepolia": {
      id: "ethereum-sepolia",
      derivation: "m/44'/60'/0'/",
      provider: "https://eth-sepolia.g.alchemy.com/v2/UXh8_WqweCDab5HcGLSzAvq61poyqp_8", // Sepolia RPC endpoint
      name: "Ethereum Sepolia",
      prefix: "0x",
      summary: "Ethereum Sepolia is a testnet version of Ethereum designed for developers to test their smart contracts and dApps.",
      website: "https://ethereum.org/en/",
      coingecko: "https://www.coingecko.com/en/coins/ethereum",
      net: "sepolia"
    },
    "ethereum-mainnet": {
      id: "ethereum-mainnet",
      derivation: "m/44'/60'/0'/",
      //https://eth-mainnet.g.alchemy.com/v2/UXh8_WqweCDab5HcGLSzAvq61poyqp_8
      provider: "https://eth.nownodes.io/ccf147fc-a634-4ad6-9135-286a9ee208de", // Mainnet RPC endpoint
      name: "Ethereum Mainnet",
      prefix: "0x",
      summary: "Ethereum Mainnet is the main Ethereum blockchain where real transactions occur.",
      website: "https://ethereum.org/en/",
      coingecko: "https://www.coingecko.com/en/coins/ethereum",
      net: "mainnet"
    }
};
