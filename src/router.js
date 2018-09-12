import React from 'react';
import { HashRouter as Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import MainLayout from "./components/MainLayout/MainLayout";

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/IndexPage'),
  });

  const Users = dynamic({
    app,
    models: () => [
      import('./models/users'),
    ],
    component: () => import('./routes/Users'),
  });

  const CnodeApp = dynamic({
    app,
    models: () => [
      import('./models/cnodejs'),
    ],
    component: () => import('./routes/CnodeApp')
  });
  return (
    <Router history={history}>
      <MainLayout location={history.location}>
        <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/users" component={Users} />
          <Route exact path="/job" component={require('./components/orgchart/EditableOrgChart').default} />
          <Route exact path="/good" component={CnodeApp} />
          <Route exact path="/d3" component={require('./routes/d3/index').default} />
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default RouterConfig;
