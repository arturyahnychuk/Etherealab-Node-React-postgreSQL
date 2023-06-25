import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class ClientService {
    updateClient(payload, clientId) {
        return axios.put(`${API_BASE}/client/profile/${clientId}`, payload, {
            headers: authHeader(),
        });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ClientService();
