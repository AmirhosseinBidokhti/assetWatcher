import { initWatcher } from "./init.js";
import { sendToDiscord } from "./utils.js";
import { watchForHackerone } from "./watchers/hackerone.js";
import { watchForIntigriti } from "./watchers/intigriti.js";
import { watchForYeswehack } from "./watchers/yeswehack.js";

const arg = process.argv.slice(2);

const main = () => {
  watchForIntigriti();
  watchForYeswehack();
  watchForHackerone();
};

if (arg[0] === "init") initWatcher();

if (arg[0] === "watch") main();
