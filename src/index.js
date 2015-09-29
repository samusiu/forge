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

// Export public API
export default { Avatar };
