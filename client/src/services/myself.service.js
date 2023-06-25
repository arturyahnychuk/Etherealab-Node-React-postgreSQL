import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class MySelfService {
    getProfile(userId) {
        return axios
            .get(`${API_BASE}/myself/profile/${userId}`, {
                headers: authHeader(),
            })
            .then((res) => res.data);
    }

    updateProfile(payload, userId) {
        return axios.put(`${API_BASE}/myself/profile/${userId}`, payload, {
            headers: authHeader(),
        });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new MySelfService();
