export const updateProject = (businessId: String, projectId: String, body: any) => {
    return fetch(`/business/update/${businessId}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
  };