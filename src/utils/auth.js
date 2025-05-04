  import { jwtDecode } from 'jwt-decode';

  export const getUserRole = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
    
      try {
        const payload = jwtDecode(token);
        return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      } catch (err) {
        console.error("Invalid token", err);
        return null;
      }
    };  

  export const isLoggedIn = () => {
    return !!localStorage.getItem('auth_token');
  };