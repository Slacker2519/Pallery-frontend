const getEnvVar = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const DB_URL = getEnvVar("VITE_DB_URL");
