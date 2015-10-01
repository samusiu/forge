import React from 'react';
import './heading.scss';

const Heading = ({src}) => (
  <div className="heading">
    <img src={src} />
  </div>
);

export default Heading;
