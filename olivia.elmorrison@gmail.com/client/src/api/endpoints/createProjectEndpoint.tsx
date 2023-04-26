export const createProject = (id: String, body: any) => {
    return fetch(`/business/projects/create/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
  };