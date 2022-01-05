import path from "path";
import { API } from "./API/index.js";

//import pkg from "deep-diff";
import { initWatcher } from "./init.js";
// const { diff } = pkg;
// const __dirname = path.resolve();

const arg = process.argv.slice(2);

if (arg[0] === "init") initWatcher();
