export const getProjects = (id: String) => {
    return fetch(`/business/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  };