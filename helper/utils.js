import fs from "fs";
import got from "got";
import {
  DISCORD_WEBHOOK,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
} from "./constants.js";

const saveData = (dataPath, data) => {
  const stringifyData = JSON.stringify(data);
  //console.log("data to be saved to db: ", stringifyData);
  console.log("Saving to DB...");

  fs.writeFileSync(dataPath, stringifyData);
  console.log("Saving to DB Done...");
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
        resolve("success");
      } else {
        const { data } = await got.post(DISCORD_WEBHOOK, {
          json: { content: msg },
        });
        console.log("Successfully sent to discord!");
        resolve("success");
      }
    } catch (error) {
      console.error(`Error while sending to discord channel: ${error}`);
    }
  });
};

const sendtoTelegram = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&&parse_mode=markdown&text=${encodeURIComponent(
        message
      )}`;

      console.log(`[+] Sending notification to telegram...`);

      const response = await got.get(apiUrl);

      if (response.statusCode === 200) {
        console.log("[+] Notification sent successfully!");
        resolve("success");
      } else {
        throw new Error(
          `[-] Failed to send notification. Status code: ${response}`
        );
      }
    } catch (error) {
      console.log(error);
      console.error("[-] Error sending notification: ", error);
    }
  });
};

function getFormattedDate() {
  const date = new Date();

  // Format date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Format time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert to 12-hour format

  // Get time zone name
  //const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // eg. 'America/Chicago'
  //console.log(timeZone);

  // Combine into final format
  return `${year}/${month}/${day} ${hours}:${minutes} ${period}`;
}

// Example usage:
console.log(getFormattedDate());

export { saveData, readData, sendToDiscord, sendtoTelegram, getFormattedDate };
