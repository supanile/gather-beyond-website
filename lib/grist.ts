import { GristDocAPI } from "grist-api";

export const grist = new GristDocAPI(process.env.GRIST_DOC_URL!, {
  apiKey: process.env.GRIST_API_KEY!
})

export const gristTrend = new GristDocAPI(process.env.GRIST_TREND_URL!, {
  apiKey: process.env.GRIST_API_KEY!
})