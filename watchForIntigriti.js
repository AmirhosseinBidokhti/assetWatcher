import { API } from "./API/index.js";
import { readData, sendToDiscord } from "./utils.js";

export const watchForIntigriti = async () => {
  const db = readData("./db/INTIGRITI.json");

  let programs = await API("intigriti");

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
      let msg = `New Program called \"${name}\" is on Intigriti!\nAssets:`;
      assets.map(({ endpoint }) => {
        msg += `\n${endpoint}`;
      });
      sendToDiscord(msg);
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

      sendToDiscord(msg);
    }
    // برنامه یه دامین رو اضافه کرده
    const results = assets.filter(
      ({ endpoint: urlapi }) =>
        !matchingProgram.targets.in_scope.find(
          ({ endpoint: urldb }) => urlapi === urldb
        )
    );
    newDomains.push(...results);
    console.log(newDomains);

    if (newDomains.length) {
      let msg = `New Assets for \"${name}\" on Intigriti!`;

      assets.map(({ endpoint }) => {
        msg += `\n${endpoint}`;
      });

      sendToDiscord(msg);
    }
  }
};

watchForIntigriti();
