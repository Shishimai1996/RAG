"use client";

import { createKeycloakClient } from "./keycloak";
import { KeycloakProvider } from "./keycloakProvider";
import Keycloak from "keycloak-js";
import { ScriptProps } from "next/script";
import { useEffect, useState } from "react";

let keycloakClientIsCreated = false;

const KeycloakWrapper: React.FC<ScriptProps> = ({ children }: ScriptProps) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  useEffect(() => {
    (async () => {
      if (!keycloakClientIsCreated) {
        keycloakClientIsCreated = true;
        const keycloakClient = await createKeycloakClient();
        setKeycloak(keycloakClient);
      }
    })();
  }, []);
  if (!keycloak) return null;

  return (
    <KeycloakProvider client={keycloak}>
      {keycloak && children}
    </KeycloakProvider>
  );
};

export default KeycloakWrapper;
