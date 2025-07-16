import dotenv from "dotenv";
dotenv.config();

export const getWoveyAccess = async () => {
  const grantType = process.env.GRANT_TYPE;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!grantType || !clientId || !clientSecret) {
    throw new Error("Authentication environment variables are missing.");
  }

  try {
    const body = `grant_type=${encodeURIComponent(
      grantType
    )}&client_id=${encodeURIComponent(
      clientId
    )}&client_secret=${encodeURIComponent(clientSecret)}`;

    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/auth/realms/woven/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }
    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};
