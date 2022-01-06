import { API } from "../api-fetcher/index.js";
import { readData, saveData, sendToDiscord } from "../helper/utils.js";
import path from "path";
const __dirname = path.resolve();

const dbPath = `${__dirname}/db/INTIGRITI.json`;

export const watchForIntigriti = () => {
  return new Promise(async (reoslve, reject) => {
    const db = readData(dbPath);

    let programs = await API("intigriti");

    programs = JSON.parse(programs);

    for (const program of programs) {
      const name = program.name;
      const assets = program.targets.in_scope;
      let newAssets = [];

      const matchingProgram = db.find(
        (dbProgram) => dbProgram.url === program.url
      );
      //یه برنامه کلا به اینتگ اضافه شده
      if (!matchingProgram) {
        let msg = `New Program called \"${name}\" is on Intigriti!\nAssets:`;
        assets.map(({ endpoint }) => {
          msg += `\n${endpoint}`;
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
        program.max_bounty.value > 0 &&
        matchingProgram.max_bounty.value === 0
      ) {
        let msg = `Program ${name} payout changed to $${program.max_bounty.value}!\nAssets:`;

        assets.map(({ endpoint }) => {
          msg += `\n${endpoint}`;
        });

        const status = await sendToDiscord(msg);

        if (status == "success") {
          matchingProgram.max_bounty.value = program.max_bounty.value;
          saveData(dbPath, db);
        }

      }
      // برنامه یه دامین رو اضافه کرده
      const results = assets.filter(
        ({ endpoint: urlapi }) =>
          !matchingProgram.targets.in_scope.find(
            ({ endpoint: urldb }) => urlapi === urldb
          )
      );
      newAssets.push(...results);
      console.log(newAssets);

      if (newAssets.length) {
        let msg = `New Assets for \"${name}\" on Intigriti!`;

        newAssets.map(({ endpoint }) => {
          msg += `\n${endpoint}`;
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
