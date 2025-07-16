"use client";

import { useEffect, useState } from "react";
import KeycloakContext from "@/src/contexts/keycloakContext";
import type Keycloak from "keycloak-js";

export interface IKeycloakProvider {
  children?: React.ReactNode;
  client: Keycloak | null;
}

export const KeycloakProvider = ({ client, children }: IKeycloakProvider) => {
  const [isAuthenticated, setState] = useState<boolean>(false);
  const [user, setUser] = useState({
    name: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    (async () => {
      if (client) {
        setState(!!client.authenticated);
        if (client && client.authenticated && client.tokenParsed) {
          setUser({
            name: client.tokenParsed.name,
            firstName: client.tokenParsed.given_name,
            lastName: client.tokenParsed.family_name,
          });
        }
      }
    })();
  }, [client]);

  return (
    <KeycloakContext.Provider value={{ client, isAuthenticated, user }}>
      {children}
    </KeycloakContext.Provider>
  );
};
