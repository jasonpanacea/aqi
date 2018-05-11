import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, HashRouter, Switch, withRouter, Link } from 'react-router-dom';

import './index.css';
import Frame from './src/layout';

ReactDOM.render((
  <HashRouter>
    <Frame />
  </HashRouter>
  ), document.getElementById('root'));
