export function getClientId() {
    let clientId = JSON.parse(localStorage.getItem('user')).username || 'Anonymous';
    return clientId;
}