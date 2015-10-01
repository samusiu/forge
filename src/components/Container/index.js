import React from 'react';
import classNames from 'classnames';
import './container.scss';

const Container = ({children, padded = false, dark = false}) => (
  <div className={classNames('container', {'-padded': padded, '-dark': dark})}>
    <div className="wrapper">
      {children}
    </div>
  </div>
);

const ContainerBlock = ({children, size = ''}) => (
  <div className={classNames('container__block', {
    '-narrow': (size === 'narrow'),
    '-half': (size === 'half'),
  })}>
    {children}
  </div>
);

export default {Container, ContainerBlock};
