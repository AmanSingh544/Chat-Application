import { CONSTANTS } from "../constants/constant"
import api from "../utils/api"

const getAllUsers = async () => {
    const response = api.get(CONSTANTS.API_ENDPOINTS.GET_ALL_USERS, {});
    return response;
}

export const userApi = {
    getAllUsers,
}