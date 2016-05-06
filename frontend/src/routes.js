import React from 'react';
import { Route, IndexRoute } from 'react-router';

import BaseComponent from './components/base/component';
import MainComponent from './components/main/component';
import BaseAdminComponent from './components/admin/component';
import UsersAdminComponent from './components/admin/users/component';
import PeManagersAdminComponent from './components/admin/peManagers/component';
import ReviewsAdminComponent from './components/admin/reviews/component';
import PeManagerComponent from './components/peManager/component';
import UserComponent from './components/user/component';

export const urls = {
  index: {
    path: '/',
  },
  peManager: {
    path: '/peManager/:peManagerId',
  },
  user: {
    path: '/user/:userId',
  },
  admin: {
    path: '/admin/',
    users: {
      path: '/admin/users',
      prefix: 'users'
    },
    peManagers: {
      path: '/admin/peManagers',
      prefix: 'peManagers'
    },
    reviews: {
      path: '/admin/reviews',
      prefix: 'reviews'
    }
  }
};

export default (
  <Route path={urls.index.path} component={BaseComponent}>
    <IndexRoute component={MainComponent} />
    <Route path={urls.peManager.path} component={PeManagerComponent} />
    <Route path={urls.user.path} component={UserComponent} />
    <Route path={urls.admin.path} component={BaseAdminComponent}>
      <Route path={urls.admin.users.prefix} component={UsersAdminComponent} />
      <Route path={urls.admin.peManagers.prefix} component={PeManagersAdminComponent} />
      <Route path={urls.admin.reviews.prefix} component={ReviewsAdminComponent} />
    </Route>
  </Route>
);
