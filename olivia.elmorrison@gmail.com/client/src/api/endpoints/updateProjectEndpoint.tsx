export const updateProject = (businessId: String, projectId: String, body: any, token: string) => {
    return fetch(`/business/update/${businessId}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
        body: JSON.stringify(body)
      })
  };