const ADMIN_KEY = process.env.ADMIN_KEY;

export const checkAdminKey = (providedKey) => {
  const ADMIN_KEY = process.env.ADMIN_KEY || "clau_secreta";
  return providedKey === ADMIN_KEY;
};