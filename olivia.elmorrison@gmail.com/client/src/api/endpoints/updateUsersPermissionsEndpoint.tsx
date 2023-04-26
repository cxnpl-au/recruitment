export const updateUserPermissions = (id: String, permissions: any, token: string) => {
    return fetch(`/users/update/permissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
        body: JSON.stringify(permissions)
      })
  };