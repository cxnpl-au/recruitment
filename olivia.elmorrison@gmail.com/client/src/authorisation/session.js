export const saveUserPermissions = (permissions) => {
    localStorage.setItem("saved_user_permissions", JSON.stringify(permissions));
};

export const getSavedUserPermissions = () => {
    const permissions = localStorage.getItem("saved_user_permissions")
        ? JSON.parse(localStorage.getItem("saved_user_permissions"))
        : "";

    return permissions;
};

export const saveBusinessId = (businessId) => {
    localStorage.setItem("saved_user_businessId", JSON.stringify(businessId));
};

export const getSavedBusinessId = () => {
    const businessId = localStorage.getItem("saved_user_businessId")
        ? JSON.parse(localStorage.getItem("saved_user_businessId"))
        : "";

    return businessId;
};