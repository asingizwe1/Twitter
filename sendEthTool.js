// src/sendEthTool.ts
import { createTool } from '@inngest/agent-kit';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!RPC_URL || !PRIVATE_KEY) {
  throw new Error('RPC_URL and PRIVATE_KEY must be set in .env');
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

export const sendEthTool = createTool({
  name: 'sendEth',
  description: 'Send ETH on the testnet: input JSON {"to":"<address>","amount":"<in ETH>"}',
  run: async ({ input }) => {
    let parsed: { to: string; amount: string };
    try {
      parsed = typeof input === 'string' ? JSON.parse(input) : input;
    } catch (err) {
      return `❌ Failed to parse JSON. Expect {"to":"0x...","amount":"0.001"}. Error: ${err}`;
    }
    const { to, amount } = parsed;
    if (!ethers.utils.isAddress(to)) {
      return `❌ Invalid address: ${to}`;
    }
    let value;
    try {
      value = ethers.utils.parseEther(amount);
    } catch (err) {
      return `❌ Invalid amount: ${amount}. Must be a decimal string. Error: ${err}`;
    }
    try {
      const txResponse = await signer.sendTransaction({ to, value });
      const receipt = await txResponse.wait(1);
      // Adjust explorer URL for your network if not Sepolia
      return `✅ Sent! Hash: ${txResponse.hash}. Confirmations: ${receipt.confirmations}. View: https://sepolia.etherscan.io/tx/${txResponse.hash}`;
    } catch (err: any) {
      return `❌ Transaction failed: ${err?.message || err}`;
    }
  },
});
