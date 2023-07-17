import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY!;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY!;
const DEVNET_PRIVATE_KEY = process.env.DEVNET_PRIVATE_KEY!;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    },
    localhost : {
      url : 'http://127.0.0.1:8545',
      accounts : [DEVNET_PRIVATE_KEY]
    },
  }
};

export default config;
