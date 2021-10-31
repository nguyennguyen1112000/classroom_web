import React from 'react';
import { Route, Switch } from 'react-router';
import CreateCourse from '../views/classes/create';


function DirectRouter() {
    return (
      <Switch>
        <Route exact path="/classes/create" component={CreateCourse} />
        {/* <Route exact path="/contact" component={Contact} />
        <Route exact path="/home" component={Home} />
        <Route
          exact
          path="/product/:slug.:id.html"
          component={Product_Detail}
        /> */}
      </Switch>
    );
}

export default DirectRouter;