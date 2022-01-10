import { Route } from 'react-router-dom';

const AuthRoute = (props) => {
  console.log('###############################', props)
  return <Route {...props} />;
};

export default AuthRoute;
