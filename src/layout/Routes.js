import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "../components/teacher/Login";
import Dashboard from "../components/teacher/Dashboard";
import Questionform from "../components/teacher/Questionform";
import Register from '.././components/registration/Register';
import Logout from "../components/teacher/Logout";



const Routes = () => (

  
  <Router>
    <Switch>
      <Route exact path="/">{<Redirect to="/login" />}</Route> 
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/question" component={Questionform} />
      <Route exact path="/logout" component={Logout} />
      <Route component={Login} />
    </Switch> 
  </Router>
  
);

export default Routes;