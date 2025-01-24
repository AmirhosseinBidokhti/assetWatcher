import { escape } from "querystring";
import { API } from "../api-fetcher/index.js";
import {
  getFormattedDate,
  readData,
  saveData,
  sendtoTelegram,
} from "../helper/utils.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = `${__dirname}/../db/HACKERONE.json`;

export const watchForHackerone = () => {
  const db = readData(dbPath);
  return new Promise(async (resolve, reject) => {
    let programs = await API("hackerone");

    programs = JSON.parse(programs);

    for (const program of programs) {
      const name = program.name;
      const assets = program.targets.in_scope;
      let newAssets = [];

      const matchingProgram = db.find(
        (dbProgram) => dbProgram.url === program.url
      );
      //یه برنامه کلا به هکروان اضافه شده
      if (!matchingProgram) {
        let msg = `* ◾️ New Program called "${name}" is on HackerOne * \n\n 🕰️ ${getFormattedDate()}\n\n *${
          program.url
        }* \n\n ⬇ Assets:`;
        assets.map(({ asset_identifier }) => {
          msg += `\`\`\`\n\n${asset_identifier}\`\`\``;
        });
        const status = await sendtoTelegram(msg);

        if (status == "success") {
          db.push(program);
          saveData(dbPath, db);
          console.log(`Just added ${name} Program to the database`);
        }

        continue;
      }
      // برنامه تا دیروز پول نمیداده بابت این دامین، الان میده
      if (program.offers_bounties && !matchingProgram.offers_bounties) {
        let msg = `* ◾️ Program ${name} on HackerOne is Paying now 💵 * \n\n 🕰️ ${getFormattedDate()}\n\n *${
          program.url
        }* \n\n ⬇ Assets:`;

        assets.map(({ asset_identifier }) => {
          msg += `\`\`\`\n\n${asset_identifier}\`\`\``;
        });

        const status = await sendtoTelegram(msg);

        if (status == "success") {
          matchingProgram.offers_bounties = program.offers_bounties;
          saveData(dbPath, db);
        }
      }
      // برنامه یه دامین رو اضافه کرده
      const results = assets.filter(
        ({ asset_identifier: urlapi }) =>
          !matchingProgram.targets.in_scope.find(
            ({ asset_identifier: urldb }) => urlapi === urldb
          )
      );
      newAssets.push(...results);

      if (newAssets.length) {
        let msg = `* ◾️ New Assets for \"${name}\" on HackerOne\*\n\n 🕰️ ${getFormattedDate()}\n\n *${
          program.url
        }* \n\n ⬇ New Assets:`;

        newAssets.map(({ asset_identifier }) => {
          msg += `\`\`\`\n\n${asset_identifier}\`\`\``;
          console.log(`New assets: ${asset_identifier}`);
        });

        const status = await sendtoTelegram(msg);

        if (status == "success") {
          matchingProgram.targets.in_scope.push(...newAssets);

          saveData(dbPath, db);
          console.log(`Just added new assets for ${name} to the database`);
        }
      } else {
        console.log(`Nothing new for ${name}`);
      }
    }
    // in order to sync the db in case of program removal or stuffs like that maybe re-add the db here
    console.log("[+] Syncing the DB lastly with a bit pause...");
    setTimeout(() => {
      saveData(dbPath, programs);
    }, 3000);
    resolve();
  });
};
