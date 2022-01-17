import "./App.css";
import Register from "./components/authentication/register";
import Login from "./components/authentication/login";
import Header from "./components/header";
import VerticalNav from "./components/vertical-nav";
import CreateClass from "./views/classes/create";
import Setting from "./views/setting/profile";
import Info from "./views/setting/info";
import { BrowserRouter as Router } from "react-router-dom";
import PublicRoute from "./router/publicRoute";
import PrivateRoute from "./router/privateRoute";
import ClassList from "./views/classes/list";
import { useSelector } from "react-redux";
import DetailClass from "./views/classes/detail";
import PublicClass from "./views/classes/public_class";
import { ToastContainer } from "react-toastify";
import ReviewDetail from "./components/manage-point/review-detail";
import ManageAccounts from "./views/admin/manage-accounts";
import Notifications from "./views/notifications";
import ManageClassrooms from "./views/admin/manage-classrooms";
import ManageAdminAccounts from "./views/admin/manage-accounts-admin";
import VerifyAccount from "./components/authentication/verify-account";
function App() {
  //const user = useSelector((state) => state.auth.currentUser);
  const logIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <Router>
      <div>
        {logIn && <Header />}
        {logIn && <VerticalNav />}
        <PublicRoute
          restricted={false}
          component={Login}
          path="/signin"
          exact
        />
        <PublicRoute
          restricted={false}
          component={Register}
          path="/signup"
          exact
        />
        <PublicRoute
          restricted={false}
          component={VerifyAccount}
          path="/verify"
          exact
        />
        <PrivateRoute component={CreateClass} path="/my-classes/create" exact />
        <PrivateRoute component={ClassList} isMyClasses={true} path="/" exact />
        <PrivateRoute
          component={ClassList}
          isMyClasses={true}
          path="/my-classes"
          exact
        />
        <PrivateRoute
          component={ClassList}
          isMyJoinedClasses={true}
          path="/joined-classes"
          exact
        />
        <PrivateRoute component={DetailClass} path="/my-classes/:code" exact />
        <PrivateRoute component={PublicClass} path="/classrooms/:code" exact />
        <PrivateRoute
          component={ReviewDetail}
          path="/classrooms/:code/reviews/:reviewId"
          exact
        />
        <PrivateRoute component={Setting} path="/setting" exact />
        <PrivateRoute component={Info} path="/profile/:id" exact />
        <PrivateRoute component={ManageAccounts} path="/admin/accounts" exact />
        <PrivateRoute
          component={ManageAdminAccounts}
          path="/admin/admin-accounts"
          exact
        />
        <PrivateRoute
          component={ManageClassrooms}
          path="/admin/classrooms"
          exact
        />
        <PrivateRoute component={Notifications} path="/notifications" exact />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
