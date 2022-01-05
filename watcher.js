import { API } from "./API/index.js";
import { msgFormatter, readData, sendToDiscord } from "./utils.js";

const watchForBugCrowd = async () => {
  const db = readData("./db/BUGCROWD.json");

  let bcPrograms = await API("bugcrowd");

  bcPrograms = JSON.parse(bcPrograms);

  for (const program of bcPrograms) {
    const name = program.name;
    const assets = program.targets.in_scope;
    let newDomains = [];

    const matchingProgram = db.find(
      (dbProgram) => dbProgram.url === program.url
    );
    //یه برنامه کلا به هکروان اضافه شده
    if (!matchingProgram) {
      sendToDiscord(
        msgFormatter({
          msgType: "newProgram",
          program: name,
          platform: "bugcrowd",
          assets,
        })
      );
      continue;
    }
    // برنامه تا دیروز پول نمیداده بابت این دامین، الان میده
    if (program.max_payout > 0 && matchingProgram.max_payout === 0) {
      sendToDiscord(
        msgFormatter({
          msgType: "payment",
          program: name,
          platform: "bugcrowd",
          assets,
          others: [program.max_payout, matchingProgram.max_payout],
        })
      );
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
      sendToDiscord(
        msgFormatter({
          msgType: "newAsset",
          program: name,
          platform: "bugcrowd",
          assets: newDomains,
        })
      );
    }
  }
};

//watchForBugCrowd();
