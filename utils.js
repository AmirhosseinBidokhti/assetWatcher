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

function chunkString(str, len) {
  const size = Math.ceil(str.length / len);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len);
    offset += len;
  }
  return r;
}

const sendToDiscord = (msg) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Sending message to discord channel...");

      if (msg.length > 2000) {
        const chunks = chunkString(msg, 500);

        chunks.map(async (chunk) => {
          const { data } = await got.post(DISCORD_WEBHOOK, {
            json: { content: chunk },
          });
        });
      } else {
        const { data } = await got.post(DISCORD_WEBHOOK, {
          json: { content: msg },
        });
        resolve("Successfully sent to discord!");
      }
    } catch (error) {
      console.error(`Error while sending to discord channel: ${error}`);
    }
  });
};

export { saveData, readData, sendToDiscord };

//const PRODUCT_PATH = `${__dirname}/server/data/products.json`;
//https://www.digitalocean.com/community/tutorials/nodejs-how-to-use__dirname
