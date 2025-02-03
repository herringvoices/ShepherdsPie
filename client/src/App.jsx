import { useEffect, useState } from "react";
import "./App.css";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Spinner } from "react-bootstrap";
import NavBar from "./components/NavBar";
import ApplicationViews from "./components/ApplicationViews";

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    tryGetLoggedInUser().then(setLoggedInUser);
  }, []);

  return loggedInUser === undefined ? (
    <Spinner animation="border" role="status" />
  ) : (
    <>
      <ApplicationViews
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </>
  );
}

export default App;
