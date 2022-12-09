/* --- USER ROUTES ---*/

// Route to create new user upon sign up
export const signupUser = (userData) => {
  return fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

// Route to log in existing user
export const loginUser = (userData) => {
  return fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

// Route to get user
export const getUser = (userId, token) => {
  return fetch(`/api/users/manage/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

// Route to create user
// During provisioning, admin can create user profiles for the people in the business
export const createUser = (userData, token) => {
  return fetch("/api/users/manage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
    body: JSON.stringify(userData),
  });
};

// Route to update user
// Admin can update users, eg. change their permissions
export const updateUser = (userId, userData, token) => {
  return fetch(`/api/users/manage/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
    body: JSON.stringify(userData),
  });
};

// Route to delete user
// Admin can delete users, eg. if they leave the business
export const deleteUser = (userId, token) => {
  return fetch(`/api/users/manage/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

/* --- BUSINESS ROUTES ---*/

// Route to get all users in a business
export const getTeam = (businessId, token) => {
  return fetch(`/api/businesses/${businessId}/admin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

// Route to get a business and its accounts
export const getBusiness = (businessId, token) => {
  return fetch(`/api/businesses/${businessId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

// Route to create business
export const createBusiness = (businessData, token) => {
  return fetch("/api/businesses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
    body: JSON.stringify(businessData),
  });
};

// Route to delete business
export const deleteBusiness = (businessId, token) => {
  return fetch(`/api/businesses/${businessId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

/* --- ACCOUNT ROUTES ---*/

// Route to get an account in a business
export const getAccount = (businessId, accountId, token) => {
  return fetch(`/api/businesses/${businessId}/accounts/${accountId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

// Route to create account under a business
export const createAccount = (businessId, accountData, token) => {
  return fetch(`/api/businesses/${businessId}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
    body: JSON.stringify(accountData),
  });
};

// Route to update account under a business
export const updateAccount = (businessId, accountId, accountData, token) => {
  return fetch(`/api/businesses/${businessId}/accounts/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
    body: JSON.stringify(accountData),
  });
};

// Route to delete account under a business
export const deleteAccount = (businessId, accountId, token) => {
  return fetch(`/api/businesses/${businessId}/accounts/${accountId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`, // user must be signed in
    },
  });
};

/* --- PASSWORD RESET ROUTES ---*/
export const requestResetPassword = (formData) => {
  return fetch("/api/resetpassword/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};

export const resetPassword = (formData) => {
  return fetch("/api/resetpassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};
