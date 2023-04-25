export const getTeam = (id: String) => {
    return fetch(`/business/team/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  };