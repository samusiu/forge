import React from 'react';
import './avatar.scss';

const Avatar = ({src}) => (
  <div className="avatar">
    <img src={src} />
  </div>
);

export default Avatar;
