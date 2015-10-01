import React, { Component } from 'react';

import { Chrome, Container, ContainerBlock, MessageCallout } from '../src/forge';

class Index extends Component {

  render() {
    return (
      <Chrome>
        <Container>
          <ContainerBlock size="narrow">
            <h1>Pre-rendering example</h1>
          </ContainerBlock>
          <ContainerBlock size="half">
            <p>During <strong>dev</strong>, assets &amp; layout are hot-reloaded by a server.</p>
            <p>During <strong>build</strong> assets &amp; layout are pre-rendered.</p>
          </ContainerBlock>
          <ContainerBlock size="half">
            <MessageCallout position="right">Hey, that's pretty hot!</MessageCallout>
          </ContainerBlock>
        </Container>
      </Chrome>
    );
  }

}

export default Index;
