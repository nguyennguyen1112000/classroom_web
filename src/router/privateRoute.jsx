import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component,    ...rest }) => {
  const logIn = useSelector((state) => state.auth.isLoggedIn);  
  return (
    <Route
      {...rest}
      render={(props) =>
        logIn ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to={`/signin?redirectTo=${props.location.pathname+props.location.search}`} />
        )
      }
    />
  );
};

export default PrivateRoute;
