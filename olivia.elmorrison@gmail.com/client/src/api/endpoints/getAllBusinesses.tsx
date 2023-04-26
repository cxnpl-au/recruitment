export const getAllBusinesses = () => {
return fetch(`/business`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
};