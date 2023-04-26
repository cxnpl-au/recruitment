export const setUserPermissions = (permissions) => {
    localStorage.setItem("saved_user_permissions", JSON.stringify(permissions));
};

export const getUserPermissions = () => {
    const permissions = localStorage.getItem("saved_user_permissions")
        ? JSON.parse(localStorage.getItem("saved_user_permissions"))
        : "";

    return permissions;
};

export const setBusinessId = (businessId) => {
    localStorage.setItem("saved_user_businessId", JSON.stringify(businessId));
};

export const getBusinessId = () => {
    const businessId = localStorage.getItem("saved_user_businessId")
        ? JSON.parse(localStorage.getItem("saved_user_businessId"))
        : "";

    return businessId;
};

export const setUserName = (username) => {
    localStorage.setItem("saved_user_name", JSON.stringify(username));
};

export const getUserName= () => {
    const username = localStorage.getItem("saved_user_name")
        ? JSON.parse(localStorage.getItem("saved_user_name"))
        : "";

    return username;
};