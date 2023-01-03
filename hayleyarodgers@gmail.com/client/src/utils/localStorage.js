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

// Upon log in or sign up, save current user's business id to local storage
export const saveBusinessId = (businessId) => {
  localStorage.setItem("saved_user_businessId", JSON.stringify(businessId));
};

// Retrieve current user's business id from local storage
export const getSavedBusinessId = () => {
  const savedBusinessId = localStorage.getItem("saved_user_businessId")
    ? JSON.parse(localStorage.getItem("saved_user_businessId"))
    : "";

  return savedBusinessId;
};
