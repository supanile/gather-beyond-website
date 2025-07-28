class GristClient {
  private baseUrl: string;
  private apiKey: string;
  private docId: string;

export const grist = new GristDocAPI(process.env.GRIST_DOC_URL!)
