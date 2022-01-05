import { API } from "./API/index.js";
import { readData, sendToDiscord } from "./utils.js";

export const watchForYeswehack = async () => {
  const db = readData("./db/YESWEHACK.json");

  let programs = await API("yeswehack");

  programs = JSON.parse(programs);

  for (const program of programs) {
    const name = program.name;
    const assets = program.targets.in_scope;
    let newDomains = [];

    const matchingProgram = db.find((dbProgram) => dbProgram.id === program.id);
    //یه برنامه کلا به هکروان اضافه شده
    if (!matchingProgram) {
      let msg = `New Program called \"${name}\" is on Yeswehack!\nAssets:`;
      assets.map(({ target }) => {
        msg += `\n${target}`;
      });
      sendToDiscord(msg);
      continue;
    }
    // برنامه تا دیروز پول نمیداده بابت این دامین، الان میده
    if (program.max_bounty > 0 && matchingProgram.max_bounty === 0) {
      let msg = `Program ${name} payout changed to $${program.max_bounty}!\nAssets:`;

      assets.map(({ target }) => {
        msg += `\n${target}`;
      });

      sendToDiscord(msg);
    }
    // برنامه یه دامین رو اضافه کرده
    const results = assets.filter(
      ({ target: urlapi }) =>
        !matchingProgram.targets.in_scope.find(
          ({ target: urldb }) => urlapi === urldb
        )
    );
    newDomains.push(...results);
    console.log(newDomains);

    if (newDomains.length) {
      let msg = `New Assets for \"${name}\" on Yeswehack!`;

      assets.map(({ target }) => {
        msg += `\n${target}`;
      });

      sendToDiscord(msg);
    }
  }
};

watchForYeswehack();
