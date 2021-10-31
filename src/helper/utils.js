export function authHeader() {
  const token = JSON.parse(localStorage.getItem("token"));
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
export function logOut() {
  localStorage.setItem("user", null);
  localStorage.setItem("token", null);
}
