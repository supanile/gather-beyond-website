class GristClient {
  private baseUrl: string;
  private apiKey: string;
  private docId: string;

  constructor() {
    this.baseUrl = "https://docs.getgrist.com/api";
    this.apiKey = process.env.GRIST_API_KEY || "";
    this.docId = process.env.GRIST_DOC_ID || "qaeDWhn6JPqY57dLSTMnpB";
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/docs/${this.docId}${endpoint}`;

    console.log(`Making Grist API request to: ${url}`);
    console.log("Request options:", {
      method: options.method || "GET",
      headers: {
        Authorization: "Bearer [HIDDEN]",
        "Content-Type": "application/json",
      },
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Grist API Error Response: ${errorText}`);
        throw new Error(
          `Grist API Error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("Grist API response data:", responseData);
      return responseData;
    } catch (error) {
      console.error("Network error in makeRequest:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Network connection failed. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  // Fetch all records from a table
  async fetchTable(tableName: string) {
    try {
      const response = await this.makeRequest(`/tables/${tableName}/records`);

      // Transform Grist response to our expected format
      return response.records.map((record: any) => ({
        id: record.id,
        ...record.fields,
      }));
    } catch (error) {
      console.error(`Failed to fetch table ${tableName}:`, error);
      throw error;
    }
  }

  // Add a new record to a table
  async addRecord(tableName: string, data: Record<string, any>) {
    try {
      const response = await this.makeRequest(`/tables/${tableName}/records`, {
        method: "POST",
        body: JSON.stringify({
          records: [
            {
              fields: data,
            },
          ],
        }),
      });

      return response.records[0];
    } catch (error) {
      console.error(`Failed to add record to ${tableName}:`, error);
      throw error;
    }
  }

  // Update an existing record
  async updateRecord(
    tableName: string,
    recordId: string | number,
    data: Record<string, any>
  ) {
    try {
      const response = await this.makeRequest(`/tables/${tableName}/records`, {
        method: "PATCH",
        body: JSON.stringify({
          records: [
            {
              id: recordId,
              fields: data,
            },
          ],
        }),
      });

      return response.records[0];
    } catch (error) {
      console.error(
        `Failed to update record ${recordId} in ${tableName}:`,
        error
      );
      throw error;
    }
  }

  // Fixed Delete method - using the correct Grist API format
  async deleteRecord(tableName: string, recordId: string | number): Promise<any> {
    const id = parseInt(String(recordId)); // Ensure it's a number
    console.log(`Deleting record ${id} from table ${tableName}`);

    try {
      // Use the /apply endpoint which is the correct way to delete records in Grist
      const response = await this.makeRequest('/apply', {
        method: "POST",
        body: JSON.stringify([
          ['BulkRemoveRecord', tableName, [id]]
        ]),
      });

      console.log("Grist delete successful:", response);

      return {
        success: true,
        deletedId: id,
        result: response,
      };
    } catch (error) {
      console.error("❌ Grist deleteRecord failed:", error);
      throw error;
    }
  }

  // Test connection method
  async testConnection() {
    try {
      console.log("Testing Grist API connection...");
      console.log("API Key configured:", !!this.apiKey);
      console.log("Doc ID:", this.docId);

      const response = await this.makeRequest("/tables");
      console.log(
        "Connection test successful. Available tables:",
        response.tables
      );
      return { success: true, tables: response.tables };
    } catch (error) {
      console.error("Connection test failed:", error);
      throw error;
    }
  }
}

export const grist = new GristClient();