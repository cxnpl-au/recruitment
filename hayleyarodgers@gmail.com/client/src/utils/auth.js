// Use to decode a token and get the user's information out of it
import decode from "jwt-decode";

// Import getting saved user role from local storage
import { getSavedUserRole } from "./localStorage";

// Create a new class to instantiate for a user
class AuthService {
  // Upon login, save the user's token to localStorage
  login(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/dashboard");
  }

  // Retrieve the user's token from localStorage
  getToken() {
    return localStorage.getItem("id_token");
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      // Decode the token to get its expiration time (that was set by the server)
      const decoded = decode(token);

      // If the expiration time is less than the current time (in seconds) then the token is expired, return true
      // If token hasn't passed its expiration time, return false
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

  // Check if the user is logged in
  loggedIn() {
    // Checks if there is a saved token
    const token = this.getToken();

    // If there is a token and it's not expired, return true
    return !!token && !this.isTokenExpired(token) ? true : false;
  }

  // Check if the user is an admin
  isAdmin() {
    // Gets saved user role from local storage
    const role = getSavedUserRole();

    // If current user's role is admin, return true
    return role === "admin" ? true : false;
  }

  // Check if the user is an editor
  isEditor() {
    // Gets saved user role from local storage
    const role = getSavedUserRole();

    // If current user's role is editor, return true
    return role === "editor" ? true : false;
  }

  // Upon logout, remove the user's token and role from localStorage
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("saved_user_role");
    localStorage.removeItem("saved_user_businessId");

    // Reload the page and reset the state of the application
    window.location.assign("/");
  }
}

export default new AuthService();
