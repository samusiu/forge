import React from 'react';
import classNames from 'classnames';
import './message-callout.scss';

const MessageCallout = ({children, position, color}) => (
  <div className={classNames('message-callout', {['-' + position]: position, ['-' + color]: color})}>
    <div className="message-callout__copy">
      <p>{children}</p>
    </div>
  </div>
);

export default MessageCallout;
