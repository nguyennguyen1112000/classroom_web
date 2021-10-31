import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    const logIn = useSelector((state) => state.auth.isLoggedIn);
    return (
      // restricted = false meaning public route
      // restricted = true meaning restricted route
      <Route
        {...rest}
        render={(props) =>
          logIn && restricted ? (
            <Redirect to="/" />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
};

export default PublicRoute;