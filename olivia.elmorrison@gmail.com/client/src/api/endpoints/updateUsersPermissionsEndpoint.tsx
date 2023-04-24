export const updateUserPermissions = (id: String, permissions: any) => {
    return fetch(`/users/update/permissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissions)
      })
  };