import { API } from "../api-fetcher/index.js";
import { readData, saveData, sendToDiscord } from "../helper/utils.js";
import path from "path";
const __dirname = path.resolve();

const dbPath = `${__dirname}/db/BUGCROWD.json`;

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
        let msg = `New Program called \"${name}\" is on Bugcrowd!\nAssets:`;
        assets.map(({ target }) => {
          msg += `\n${target}`;
        });

        const status = await sendToDiscord(msg);

        if (status == "success") {
          db.push(program);
          saveData(dbPath, db);
          console.log(`Just added ${name} Program to the database`);
        }

        continue;
      }
      // برنامه تا دیروز پول نمیداده بابت این دامین، الان میده
      if (
        program.max_payout > 0 &&
        matchingProgram.max_payout === 0
      ) {
        let msg = `Program ${name} payout changed to $${program.max_payout}!\nAssets:`;

        assets.map(({ target }) => {
          msg += `\n${target}`;
        });

        const status = await sendToDiscord(msg);

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
      console.log(newAssets);

      if (newAssets.length) {
        let msg = `New Assets for \"${name}\" on Bugcrowd!`;

        newAssets.map(({ target }) => {
          msg += `\n${target}`;
        });

        const status = await sendToDiscord(msg);
        if (status == "success") {
          matchingProgram.targets.in_scope.push(...newAssets);

          saveData(dbPath, db);
          console.log(`Just added new assets for ${name} to the database`);
        }

      }
    }
    reoslve();
  });
};
