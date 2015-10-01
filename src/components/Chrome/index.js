import React from 'react';
import './chrome.scss';

const Chrome = ({children}) => (
  <div className="chrome">
    <div className="wrapper">
      {children}
    </div>
  </div>
);

export default Chrome;
