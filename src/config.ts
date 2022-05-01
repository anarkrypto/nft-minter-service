import { config } from "dotenv";
config();

export const AMQP_URL: string = process.env.AMQP_URL || "amqp://localhost:5673";
export const RPC_URL: string = process.env.RPC_URL || "";
export const MAX_ETHER_FEE: number = Number(process.env.MAX_ETHER_FEE) || 0;
export const CONTRACT_ADDRESS: string = process.env.CONTRACT_ADDRESS || "";
export const PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";
