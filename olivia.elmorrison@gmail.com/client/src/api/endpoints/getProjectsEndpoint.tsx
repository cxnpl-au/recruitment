export const getProjects = (id: string, token: string) => {
    return fetch(`/business/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
      })
  };