// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { createAgent, createNetwork, openai } from '@inngest/agent-kit';
import { sendEthTool } from './sendEthTool';

const onchainAgent = createAgent({
  name: 'Onchain Sender',
  description: 'Sends testnet ETH when instructed.',
  system: `
