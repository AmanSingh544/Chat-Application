import React, { createContext, useCallback, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const NotificationContext = createContext();

const defaultNotification = {
    message: '',
    type: 'info', // 'success' | 'error' | 'warning' | 'info'
    timeout: 5000,
};

const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(defaultNotification);
    const [open, setOpen] = useState(false);

    const addNotification = (newNotification) => {
        setNotification({
            ...defaultNotification,
            ...newNotification
        });
        setOpen(true);
    };

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const safeApiCall = useCallback(async (apiCall) => {
        try {
            const response = await apiCall();
            console.log(`✅ API call successful: 
            URL- ${response?.config?.baseURL + response?.config?.url} 
            Method - ${response?.config?.method}
            Response :` , response?.data);

            addNotification({ message: response?.data?.message, type: 'success' });
            if(response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                window.location.href = '/login'; // Adjust the path as needed
            }
            return { success: true, data: response?.data };
        } catch (error) {
            const errmsg = error.response?.data?.message || error.message || "Unexpected error";
            // console.error(`❌ API call failed:   URL- ${response?.config?.baseURL + response?.config?.url} 
            // Method - ${response?.config?.method}
            // Response :` , response?.data);

            addNotification({ message: errmsg, type: 'error' });
            if(error.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                window.location.href = '/login'; // Adjust the path as needed
            }
            return {
                success: false,
                message: errmsg,
            };
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, handleClose, safeApiCall }}>
            <Snackbar
                open={open}
                autoHideDuration={notification.timeout}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={notification.type} onClose={handleClose} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
export default NotificationProvider;
