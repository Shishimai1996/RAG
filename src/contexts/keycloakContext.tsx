"use client";

import { createContext } from "react";
import type Keycloak from "keycloak-js";

interface IUser {
  name: string;
  firstName: string;
  lastName: string;
  image?: string;
}

interface IKeycloakContext {
  client: Keycloak | null;
  isAuthenticated: boolean;
  user: IUser;
}

const KeycloakContext = createContext<IKeycloakContext>({
  client: null,
  isAuthenticated: false,
  user: {
    name: "",
    firstName: "",
    lastName: "",
  },
});

export default KeycloakContext;
