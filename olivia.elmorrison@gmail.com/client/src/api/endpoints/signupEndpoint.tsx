export const signupUser = (body: any) => {
    return fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });
  };