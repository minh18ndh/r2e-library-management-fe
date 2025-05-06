import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const token = localStorage.getItem('auth_token');

  const isLoggedIn = useMemo(() => {
    if (!token) return false;
    try {
      const payload = jwtDecode(token);
      if (payload.exp && Date.now() >= payload.exp * 1000) return false;
      return true;
    } catch {
      return false;
    }
  }, [token]);

  const userRole = useMemo(() => {
    if (!token) return null;
    try {
      const payload = jwtDecode(token);
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  }, [token]);

  const userName = useMemo(() => {
    if (!token) return null;
    try {
      const payload = jwtDecode(token);
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
    } catch {
      return null;
    }
  }, [token]);

  return { isLoggedIn, userRole, userName };
};