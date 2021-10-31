import "./App.css";
import Register from "./components/authentication/register";
import Login from "./components/authentication/login";
import Header from "./components/header";
import VerticalNav from "./components/vertical-nav";
import CreateClass from "./views/classes/create";
import { BrowserRouter as Router} from "react-router-dom";
import PublicRoute from "./router/publicRoute";
import PrivateRoute from "./router/privateRoute";
import ClassList from "./views/classes/list";
import { useSelector } from "react-redux";
function App() {
  //const user = useSelector((state) => state.auth.currentUser);
  const logIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <Router>
      <div>
        {logIn && <Header />}
        {logIn && <VerticalNav />}
        <PublicRoute restricted={true} component={Login} path="/signin" exact />
        <PublicRoute
          restricted={true}
          component={Register}
          path="/signup"
          exact
        />
        <PrivateRoute component={CreateClass} path="/my-classes/create" exact />
        <PrivateRoute component={ClassList} path="/" exact />

      </div>
    </Router>
  );
}

export default App;
