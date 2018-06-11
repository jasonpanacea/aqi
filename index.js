import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './index.css';
import Frame from './src/layout';

ReactDOM.render((
  <HashRouter>
    <LocaleProvider locale={zh_CN}><Frame /></LocaleProvider>
  </HashRouter>
  ), document.getElementById('root'));
