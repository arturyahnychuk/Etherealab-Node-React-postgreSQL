import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class DashboardService {
    search(data) {
        return axios.post(`${API_BASE}/client/patient-search`, data, {
            headers: authHeader(),
        });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DashboardService();
