import BaseApi from "./baseapi";

class KipuApi extends BaseApi {
  baseUrl: string = "kipu";

  async getDashboard() {
    return await this.get(`${this.baseUrl}/kipu_dashboard`);
  }

  async getEvents() {
    return await this.get(`${this.baseUrl}/events`);
  }

  async getExportMaster() {
    return await this.get(`${this.baseUrl}/export/master-patient-list`);
  }

  async getImportsRuns(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
  }) {
    const filteredParams: Record<string, string> = {};

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "undefined") {
        if (key === "status" && value === "pending") {
          filteredParams[key] = "in_progress";
        } else {
          filteredParams[key] = String(value);
        }
      }
    });

    const query = new URLSearchParams(filteredParams).toString();
    return await this.get(`${this.baseUrl}/import_runs?${query}`);
  }

  async getRoomMapping() {
    return await this.get(`${this.baseUrl}/room_mapping`);
  }

  async getWebhookEvents() {
    return await this.get(`${this.baseUrl}/webhook_events`);
  }

  async getLocations() {
    return await this.get(`${this.baseUrl}/locations`);
  }

  async getPatientsCensus() {
    return await this.get(`${this.baseUrl}/patients/census`);
  }

  async getPatientsOccupancy() {
    return await this.get(`${this.baseUrl}/patients/occupancy`);
  }

  async getVmsSync() {
    return await this.get(`${this.baseUrl}/vms_sync`);
  }
}

export const kipuApi = new KipuApi();
export default kipuApi;
