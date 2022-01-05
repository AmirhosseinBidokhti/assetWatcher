import { API } from "../api-fetcher/index.js";
import { readData, sendToDiscord } from "../utils.js";

export const watchForHackerone = async () => {
  const db = readData("./db/HACKERONE.json");

  let programs = await API("hackerone");

  programs = JSON.parse(programs);

  for (const program of programs) {
    const name = program.name;
    const assets = program.targets.in_scope;
    let newDomains = [];

    const matchingProgram = db.find(
      (dbProgram) => dbProgram.url === program.url
    );
    //یه برنامه کلا به هکروان اضافه شده
    if (!matchingProgram) {
      let msg = `New Program called \"${name}\" is on Hackerone!\nAssets:`;
      assets.map(({ asset_identifier }) => {
        msg += `\n${asset_identifier}`;
      });
      sendToDiscord(msg);
      continue;
    }
    // برنامه تا دیروز پول نمیداده بابت این دامین، الان میده
    if (program.offers_bounties && !matchingProgram.offers_bounties) {
      let msg = `Jesus! Program ${name} is now willing to pay hackers!\nAssets:`;

      assets.map(({ asset_identifier }) => {
        msg += `\n${asset_identifier}`;
      });

      sendToDiscord(msg);
    }
    // برنامه یه دامین رو اضافه کرده
    const results = assets.filter(
      ({ asset_identifier: urlapi }) =>
        !matchingProgram.targets.in_scope.find(
          ({ asset_identifier: urldb }) => urlapi === urldb
        )
    );
    newDomains.push(...results);
    console.log(newDomains);

    if (newDomains.length) {
      let msg = `New Assets for \"${name}\" on Hackerone!`;

      newDomains.map(({ asset_identifier }) => {
        msg += `\n${asset_identifier}`;
      });

      sendToDiscord(msg);
    }
  }
};

//watchForHackerone();
