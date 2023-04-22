export const loginUser = (userData: LoginUserRequest) => {
    return fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  };

  export interface LoginUserRequest {
    email: String,
    password: String
  }