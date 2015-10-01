import React from 'react';
import classNames from 'classnames';
import './button.scss';

const Button = ({label = '', style = '', disabled = false, loading = false}) => (
  <a className={classNames('button', {'is-disabled': disabled, 'is-loading': loading, '-secondary': (style === 'secondary'), '-tertiary': (style === 'tertiary')})}>{label}</a>
);

export default Button;
