import got from "got";
import { BUG_BOUNTY_PLATFORMS } from "../constants.js";

export const API = async (bugBountyPlatform) => {
  switch (bugBountyPlatform) {
    case "hackerone":
      try {
        console.log("Fetching the data of hackerone...");
        const response = await got(BUG_BOUNTY_PLATFORMS.HACKERONE);

        return response.body;
      } catch (error) {
        console.error(`Error while fetching program: ${error}`);
      }
      break;
    case "bugcrowd":
      try {
        console.log("Fetching the data of bugcrowd...");
        const response = await got(BUG_BOUNTY_PLATFORMS.BUGCROWD);

        return response.body;
      } catch (error) {
        console.error(`Error while fetching program: ${error}`);
      }
      break;
    case "intigriti":
      try {
        console.log("Fetching the data of intigriti...");
        const response = await got(BUG_BOUNTY_PLATFORMS.INTIGRITI);

        return response.body;
      } catch (error) {
        console.error(`Error while fetching program: ${error}`);
      }
      break;
    case "hackenproof":
      try {
        console.log("Fetching the data of hackenproof...");
        const response = await got(BUG_BOUNTY_PLATFORMS.HACKENPROOF);

        return response.body;
      } catch (error) {
        console.error(`Error while fetching program: ${error}`);
      }
      break;
    case "yeswehack":
      try {
        console.log("Fetching the data of yeswehack...");
        const response = await got(BUG_BOUNTY_PLATFORMS.YESWEHACK);

        return response.body;
      } catch (error) {
        console.error(`Error while fetching program: ${error}`);
      }
      break;
    case "federacy":
      try {
        console.log("Fetching the data of federacy...");
        const response = await got(BUG_BOUNTY_PLATFORMS.FEDERACY);

        return response.body;
      } catch (error) {
        console.error(`Error while fetching program: ${error}`);
      }
      break;

    default:
      break;
  }
};
