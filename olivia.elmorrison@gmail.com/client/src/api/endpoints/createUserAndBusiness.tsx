export const createUserAndBusiness = (body: any) => {
    return fetch('/users/create/business', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
  };