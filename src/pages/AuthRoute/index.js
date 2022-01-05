import { Route } from "react-router-dom";

const AuthRoute = (props) => {
  const user = localStorage.getItem("user");
  return <Route {...props} />;
};

export default AuthRoute;
