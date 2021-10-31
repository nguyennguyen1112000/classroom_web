import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const logIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <Route
      {...rest}
      render={(props) =>
        logIn ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default PrivateRoute;
