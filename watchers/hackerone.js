import { API } from "../api-fetcher/index.js";
import { readData, saveData, sendToDiscord } from "../utils.js";
import path from "path";
const __dirname = path.resolve();

const dbPath = `${__dirname}/db/HACKERONE.json`;

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
        let msg = `New Program called \"${name}\" is on Hackerone!\nAssets:`;
        assets.map(({ asset_identifier }) => {
          msg += `\n${asset_identifier}`;
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
      if (program.offers_bounties && !matchingProgram.offers_bounties) {
        let msg = `Program ${name} is now willing to pay hackers!\nAssets:`;

        assets.map(({ asset_identifier }) => {
          msg += `\n${asset_identifier}`;
        });

        const status = await sendToDiscord(msg);

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
      console.log(newAssets);

      if (newAssets.length) {
        let msg = `New Assets for \"${name}\" on Hackerone!`;

        newAssets.map(({ asset_identifier }) => {
          msg += `\n${asset_identifier}`;
        });

        const status = await sendToDiscord(msg);

        if (status == "success") {
          matchingProgram.targets.in_scope.push(...newAssets);

          saveData(dbPath, db);
          console.log(`Just added new assets for ${name} to the database`);
        }
      } else {
        continue;
      }
    }
    resolve();
  });
};

//watchForHackerone();
