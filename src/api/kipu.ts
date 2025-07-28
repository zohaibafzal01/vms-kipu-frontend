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

  async getImportsRuns(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
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
