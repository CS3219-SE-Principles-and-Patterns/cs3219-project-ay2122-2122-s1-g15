import React, { useEffect, createContext } from "react";
import Auth from "./Authentication";
import Db from "./Database";

export const UserContext = createContext({ user: null, setUser: () => {} });

export default function UserProvider(props) {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    Auth.observeAuthState(async (firebaseUser) => {
      if (firebaseUser == null) {
        setUser({});
        return;
      }

      const userData = await Db.getUserData(firebaseUser.uid);

      firebaseUser.data = userData;

      setUser(firebaseUser);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
