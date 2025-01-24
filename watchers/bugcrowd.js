import { API } from "../api-fetcher/index.js";
import {
  getFormattedDate,
  readData,
  saveData,
  sendToDiscord,
  sendtoTelegram,
} from "../helper/utils.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = `${__dirname}/../db/BUGCROWD.json`;

export const watchForBugCrowd = () => {
  return new Promise(async (reoslve, reject) => {
    const db = readData(dbPath);

    let programs = await API("bugcrowd");

    programs = JSON.parse(programs);

    for (const program of programs) {
      const name = program.name;
      const assets = program.targets.in_scope;
      let newAssets = [];

      const matchingProgram = db.find(
        (dbProgram) => dbProgram.url === program.url
      );
      //یه برنامه کلا به باگکراد اضافه شده
      if (!matchingProgram) {
        let msg = `* 🔸 New Program called "${name}" is on BugCrowd* \n\n 🕰️ ${getFormattedDate()}\n\n *${
          program.url
        }*\n\n ⬇ Assets:`;

        assets.map(({ target }) => {
          msg += `\`\`\`\n\n${target}\`\`\``;
        });

        const status = await sendtoTelegram(msg);

        if (status == "success") {
          db.push(program);
          saveData(dbPath, db);
          `[${getFormattedDate()}] Just added ${name} Program to the database`;
        }

        continue;
      }
      // برنامه تا دیروز پول نمیداده بابت این دامین، الان میده
      if (program.max_payout > 0 && matchingProgram.max_payout === 0) {
        let msg = `* 🔸 Program ${name} payout on BugCrowd changed to $${
          program.max_payout
        } * \n\n 🕰️ ${getFormattedDate()}\n\n*${program.url}*\n\n ⬇ Assets:`;
        assets.map(({ target }) => {
          msg += `\`\`\`\n\n${target}\`\`\``;
        });

        const status = await sendtoTelegram(msg);

        if (status == "success") {
          matchingProgram.max_payout = program.max_payout;
          saveData(dbPath, db);
        }
      }
      // برنامه یه دامین رو اضافه کرده
      const results = assets.filter(
        ({ target: urlapi }) =>
          !matchingProgram.targets.in_scope.find(
            ({ target: urldb }) => urlapi === urldb
          )
      );
      newAssets.push(...results);

      if (newAssets.length) {
        let msg = `* 🔸 New Assets for \"${name}\" on BugCrowd\*\n\n 🕰️ ${getFormattedDate()}\n\n *${
          program.url
        }*\n\n ⬇ New Assets:`;

        newAssets.map(({ target }) => {
          msg += `\`\`\`\n\n${target}\`\`\``;
          console.log(`[${getFormattedDate()}] New assets: ${target}`);
        });

        const status = await sendtoTelegram(msg);
        if (status == "success") {
          matchingProgram.targets.in_scope.push(...newAssets);

          saveData(dbPath, db);
          console.log(
            `[${getFormattedDate()}] Just added new assets for ${name} to the database`
          );
        }
      } else {
        console.log(`[${getFormattedDate()}] Nothing new for ${name}`);
      }
    }

    // in order to sync the db in case of program removal or stuffs like that maybe re-add the db here
    console.log("[+] Syncing the DB lastly with a bit pause...");
    setTimeout(() => {
      saveData(dbPath, programs);
    }, 3000);
    reoslve();
  });
};
