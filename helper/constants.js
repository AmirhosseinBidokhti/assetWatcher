import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const BUG_BOUNTY_PLATFORMS = {
  HACKERONE:
    "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/hackerone_data.json",
  BUGCROWD:
    "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/bugcrowd_data.json",
  INTIGRITI:
    "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/intigriti_data.json",
  // HACKENPROOF:
  //   "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/master/data/hackenproof_data.json",
  // YESWEHACK:
  //   "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/yeswehack_data.json",
  // FEDERACY:
  //   "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/federacy_data.json",
};

export const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || "";
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

let someHidden = "testing gittttt";

export {
  BUG_BOUNTY_PLATFORMS,
  DISCORD_WEBHOOK,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
};
