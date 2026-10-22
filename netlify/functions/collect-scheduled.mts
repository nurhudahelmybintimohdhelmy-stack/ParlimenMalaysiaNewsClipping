import type { Config } from "@netlify/functions";
import { collectParliamentNews } from "../lib/collect.js";

export default async () => {
  await collectParliamentNews("schedule");
};

export const config: Config = {
  schedule: "*/30 * * * *",
};
