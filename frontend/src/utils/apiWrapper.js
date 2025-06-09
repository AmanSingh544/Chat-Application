// const safeApiCall = async (apiCall) => {
//     try {
//         const response = await apiCall();
//         console.log(`API call successful: 
//             URL- ${response?.config?.baseURL + response?.config?.url} 
//             Method - ${response?.config?.method}
//             Response :` ,response?.data);

//         return { success: true, data: response?.data };
//     } catch (error) {
//         console.error(`API call failed: ${apiCall.name}`, error);

//         return {
//             success: false,
//             message: error.response?.data?.message || error.message || "Unexpected error",
//         };
//     }
// };

// export default safeApiCall;
