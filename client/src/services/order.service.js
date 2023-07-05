import axios from "axios";

import { API_BASE } from "../utils/API_BASE";
import authHeader from "./auth-header";

class OrderService {
    async createOrders(patient_id, data) {
        const res = await axios.post(
            `${API_BASE}/order/${patient_id}/create-order`,
            { orders: data },
            {
                headers: authHeader(),
            }
        );
        return res.data;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new OrderService();
