import { API } from "../api-fetcher/index.js";
import { readData, saveData, sendToDiscord } from "../utils.js";
import path from "path";
const __dirname = path.resolve();

const dbPath = `${__dirname}/db/FEDERACY.json`;

export const watchForFederacy = () => {
  return new Promise(async (reoslve, reject) => {
    const db = readData(dbPath);

    let programs = await API("federacy");

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
        let msg = `New Program called \"${name}\" is on Fededracy!\nAssets:`;
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
        let msg = `New Assets for \"${name}\" on Fededracy!`;

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
