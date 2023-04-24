export const getUsers = (id: String) => {
    //TODO: passid
    return fetch("/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  };