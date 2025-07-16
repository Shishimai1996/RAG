import Keycloak from "keycloak-js";
import type { KeycloakInitOptions } from "keycloak-js";
import { useContext } from "react";
import KeycloakContext from "../src/contexts/keycloakContext";

interface IKeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const keycloakConfig: IKeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
};

interface IKeycloakToken {
  idToken?: string;
  token?: string;
  refreshToken?: string;
}

export let currentToken = "";
const handleKeycloakTokensChange = ({ token }: IKeycloakToken) => {
  currentToken = token || "";
};

export const createKeycloakClient = async (): Promise<Keycloak> => {
  const keycloakClient = new Keycloak(keycloakConfig);

  keycloakClient.onAuthSuccess = (): void => {
    handleKeycloakTokensChange({
      idToken: keycloakClient.idToken,
      token: keycloakClient.token,
      refreshToken: keycloakClient.refreshToken,
    });
  };

  keycloakClient.onAuthRefreshSuccess = (): void => {
    handleKeycloakTokensChange({
      idToken: keycloakClient.idToken,
      token: keycloakClient.token,
      refreshToken: keycloakClient.refreshToken,
    });
  };

  keycloakClient.onTokenExpired = () => {
    keycloakClient.updateToken(30);
  };

  await keycloakClient.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    redirectUri: window.location.origin,
    checkLoginIframe: false,
    scope: "openid email",
  } as KeycloakInitOptions);

  return keycloakClient;
};

export function useKeycloak() {
  return useContext(KeycloakContext);
}
