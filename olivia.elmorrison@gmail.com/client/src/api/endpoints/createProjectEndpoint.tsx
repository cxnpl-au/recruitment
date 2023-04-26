export const createProject = (id: String, body: any, token: string) => {
    return fetch(`/business/projects/create/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
        body: JSON.stringify(body)
      })
  };