/**
 * Main entry-point and API for Forge.
 *
 * This file is transpiled to ES5 for usage through NPM. It is also made
 * available as an AMD/CommonJS module in `dist/forge.js`, or attached
 * to `window.Forge` when included on a page as a script tag.
 */

// These are our base styles - HTML reset, font declarations,
// base elements, animation keyframes, and utility classes.
// Consider it a coat of "primer" before we begin building.
import './base/base.scss';

// Components and their markup/logic:
import Avatar from './components/Avatar';
import Button from './components/Button';
import Chrome from './components/Chrome';
import { Container, ContainerBlock } from './components/Container';
import MessageCallout from './components/MessageCallout';
import Heading from './components/Heading';

// Export public API
export default {
  Avatar, Button, Chrome, Container, ContainerBlock, MessageCallout,
  Heading,
};
