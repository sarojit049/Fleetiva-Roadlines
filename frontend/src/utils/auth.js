// Manual JWT decode to avoid dependency

// Using a lightweight manual decode if we don't want to add a dependency, 
// OR we can use 'jwt-decode' if we install it. 
// Given the user instructions, I should probably check if jwt-decode is installed or just implement a simple one.
// The package.json did NOT show jwt-decode. 
// I will implement a safe manual decode to avoid adding dependencies unless requested, 
// OR I can add the dependency. Adding dependency is cleaner.
// User said "make PR", usually adding deps is fine. 
// But manual decode is also fine for simple JWTs.
// Let's safe-check: typical JWT is header.payload.signature
// I'll implement a robust manual decoder to avoid extra deps for now.

export const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const isTokenExpired = (token) => {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

export const getUserRole = (token) => {
    const decoded = parseJwt(token);
    return decoded ? decoded.role : null;
};
