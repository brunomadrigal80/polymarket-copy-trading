import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: requireEnv("NODE_ENV"),
  polymarketApiBase: requireEnv("POLYMARKET_API_BASE"),
  defaultLimit: Number(process.env.DEFAULT_LIMIT ?? 25),
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 5000),
};