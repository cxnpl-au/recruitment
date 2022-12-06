// Upon log in or sign up, save current user's role to local storage so it can be used for authorisation
export const saveUserRole = (userRole) => {
  localStorage.setItem("saved_user_role", JSON.stringify(userRole));
};

// Retrieve current user's role from local storage
export const getSavedUserRole = () => {
  const savedUserRole = localStorage.getItem("saved_user_role")
    ? JSON.parse(localStorage.getItem("saved_user_role"))
    : "";

  return savedUserRole;
};
