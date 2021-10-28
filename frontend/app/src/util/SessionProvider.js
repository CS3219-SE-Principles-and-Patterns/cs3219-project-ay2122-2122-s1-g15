import React, { useState, createContext } from "react";

export const SessionContext = createContext({});

export default function SessionProvider(props) {
  const [initiateDisconnect, setInitiateDisconnect] = useState(false);
  const [hasDisconnected, setHasDisconnected] = useState(false);
  const [session, setSession] = useState()

  return (
    <SessionContext.Provider
      value={{
        initiateDisconnect,
        setInitiateDisconnect,
        hasDisconnected,
        setHasDisconnected,
        session,
        setSession
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}
