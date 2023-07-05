import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class PatientService {
    async getPatients(data) {
        const res = await axios.post(`${API_BASE}/patient/search`, data, {
            headers: authHeader(),
        });
        return res.data;
    }

    async createPatient(data) {
        const res = await axios.post(
            `${API_BASE}/patient/create-patient`,
            data,
            {
                headers: authHeader(),
            }
        );

        return res.data;
    }

    async validate(data) {
        return await axios.post(`${API_BASE}/patient/email/validate`, data, {
            headers: authHeader(),
        });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PatientService();
