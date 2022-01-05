import fs from "fs";
import got from "got";
import { DISCORD_WEBHOOK } from "./constants.js";

const saveData = (dataPath, data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(dataPath, stringifyData);
};

const readData = (dataPath) => {
  const jsonData = fs.readFileSync(dataPath);
  if (jsonData.length) {
    return JSON.parse(jsonData);
  } else {
    return "empty";
  }
};

//MSG_TYPE (newAsset, payment, newProgram, enabled)

const msgFormatter = (msg) => {
  const { msgType, program, platform, assets, others } = msg;

  let finalMessage = "";

  switch (msgType) {
    case "newAsset":
      finalMessage += `New Assets for ${program} on ${platform}!`;

      assets.map(({ target }) => {
        finalMessage += `\n${target}`;
      });
      return finalMessage;

    case "newProgram":
      finalMessage += `New Program called ${program} is on ${platform}!\nAssets:`;

      assets.map(({ target }) => {
        finalMessage += `\n${target}`;
      });
      return finalMessage;

    case "payment":
      finalMessage += `Program ${program} payout changed from $${others[1]} to $${others[0]}\nAssets:`;

      assets.map(({ target }) => {
        finalMessage += `\n${target}`;
      });
      return finalMessage;

    default:
      break;
  }
};

const sendToDiscord = (msg) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Sending message to discord channel...");
      const { data } = await got.post(DISCORD_WEBHOOK, {
        json: { content: msg },
      });
      resolve("Successfully sent to discord!");
    } catch (error) {
      console.error(`Error while sending to discord channel: ${error}`);
    }
  });
};

export { saveData, readData, sendToDiscord, msgFormatter };

//const PRODUCT_PATH = `${__dirname}/server/data/products.json`;
//https://www.digitalocean.com/community/tutorials/nodejs-how-to-use__dirname
