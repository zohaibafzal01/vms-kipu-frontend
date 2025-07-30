import BaseApi from "./baseapi";

class PatientApi extends BaseApi {
  baseUrl: string = "patient";
  async getPatient(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    return await this.get(`${this.baseUrl}`, { params });
  }
}

export const patientApi = new PatientApi();
export default patientApi;
