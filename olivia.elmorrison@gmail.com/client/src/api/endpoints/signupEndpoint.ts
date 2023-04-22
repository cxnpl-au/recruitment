export const signupUser = (userData: SignupUserRequest) => {
    return fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
    });
  };

export interface SignupUserRequest {
    name: String,
    email: String,
    password: String
}