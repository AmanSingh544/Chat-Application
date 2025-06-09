import { CONSTANTS } from '../constants/constant';
import api from '../utils/api';

const createRoom = async (roomName, purpose, isPrivate) => {
    const response = await api.post(CONSTANTS.API_ENDPOINTS.CREATE_ROOM, {
        name: roomName,
        purpose: purpose,
        isPrivate: isPrivate,
    });
    return response;
};

const getRooms = async () => {
    const response = await api.get(CONSTANTS.API_ENDPOINTS.GET_ROOMS, {});
    return response;
};

const getRoomById = async (roomId) => {
    const response = await api.get(CONSTANTS.API_ENDPOINTS.GET_ROOM_BY_ID(roomId), {});
    return response;
}

const joinRoom = async (roomId) => {
    const response = await api.post(CONSTANTS.API_ENDPOINTS.JOIN_ROOM(roomId), {});
    return response;
}

const addMembers = async (members, roomId) => {
    const response = await api.put(CONSTANTS.API_ENDPOINTS.ADD_MEMBER, {
        members: members,
        roomId: roomId
    });
    return response;
}

export const roomsApi = {
    createRoom,
    getRooms,
    getRoomById,
    joinRoom,
    addMembers,
};
