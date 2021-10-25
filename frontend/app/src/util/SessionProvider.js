import React, { useState, createContext } from "react";

export const SessionContext = createContext({});

export default function SessionProvider(props) {
  const [initiateDisconnect, setInitiateDisconnect] = useState(false);
  const [hasDisconnected, setHasDisconnected] = useState(false);

  return (
    <SessionContext.Provider
      value={{
        initiateDisconnect,
        setInitiateDisconnect,
        hasDisconnected,
        setHasDisconnected,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}
