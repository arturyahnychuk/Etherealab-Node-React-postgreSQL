import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class CatalogService {
    async searchCatalog(data) {
        const res = await axios.post(`${API_BASE}/catalog/search`, data, {
            headers: authHeader(),
        });
        return res.data;
    }
    async getLabCompanies() {
        const res = await axios.get(`${API_BASE}/catalog/lab-companies`, {
            headers: authHeader(),
        });
        return res.data;
    }
    addFavorite(data) {
        return axios.post(`${API_BASE}/catalog/lab-company/favorite`, data, {
            headers: authHeader(),
        });
    }
    removeFavorite(id) {
        return axios.delete(`${API_BASE}/catalog/lab-company/favorite/${id}`, {
            headers: authHeader(),
        });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CatalogService();
