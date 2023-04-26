export const getTeam = (id: String, token: string) => {
    return fetch(`/business/team/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token
        }
      })
  };