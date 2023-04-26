import decode from "jwt-decode";

import { getSavedUserPermissions } from "./session";

class AuthService {
  
  login(idToken) {
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);

      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("id_token");
        localStorage.removeItem("saved_user_role");
        localStorage.removeItem("saved_user_businessId");
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isAdmin() {
    const permissions = getSavedUserPermissions();
    return permissions === "ADMIN";
  }

  isAdminOrApprover() {
    const permissions = getSavedUserPermissions();
    return permissions === "ADMIN" || permissions === "APPROVER";
  }

  isSubmitter() {
    const permissions = getSavedUserPermissions();
    return permissions === "ADMIN" || permissions === "APPROVER";
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("saved_user_role");
    localStorage.removeItem("saved_user_businessId");

    window.location.assign("/");
  }
}

export default new AuthService();
