import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <>Welcome</>
            </AuthorizedRoute>
          }
        />
        <Route path="/orders">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Orders
              </AuthorizedRoute>
            }
          />
          <Route
            path="create"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Create ORder
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                View Order
              </AuthorizedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Edit Order
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route path="employees">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Employees
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Employee Details
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id/edit"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Edit Employee
              </AuthorizedRoute>
            }
          />
          <Route
            path="create"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                Create Employee
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
