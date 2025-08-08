import BaseApi from "./baseapi";

class KipuApi extends BaseApi {
  baseUrl: string = "kipu";

  async getDashboard() {
    return await this.get(`${this.baseUrl}/dashboard`);
  }

  async getEvents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    event?: string;
  }) {
    return await this.get(`${this.baseUrl}/events`, { params });
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

  async getRoomMapping(page: number, limit: number = 10) {
    return await this.get(`${this.baseUrl}/room_mapping`, {
      params: { page, limit },
    });
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

  async getVmsSync(page: number, limit: number = 10) {
    return await this.get(`${this.baseUrl}/vms_sync`, {
      params: { page, limit },
    });
  }

  async exportMaster(body: any = {}) {
    return await this.post(`${this.baseUrl}/import`, body);
  }
}

export const kipuApi = new KipuApi();
export default kipuApi;
