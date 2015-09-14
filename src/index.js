/**
 * Main entry-point and API for Forge.
 *
 * This file is transpiled to ES5 for usage through NPM. It is also made
 * available as an AMD/CommonJS module in `dist/forge.js`, or attached
 * to `window.Forge` when included on a page as a script tag.
 */

import './components/tabs';
import './components/footnote';
import './regions/footer';
import './regions/navigation';
import './utilities/jump-scroll';
import './utilities/scroll-indicator';
import Messages from './components/messages';

// Export public API
export default { Messages };
