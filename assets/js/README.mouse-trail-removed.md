# Mouse Trail Effect Removed

The mouse-trail effect has been removed from the main site.
- The canvas node and script tag were removed from `index.html`.
- The `mouse-trail.js` script was replaced with a noop stub to prevent runtime errors.
- The `mouse-trail-canvas` CSS rules were removed from `assets/css/style.css`.

Note: The original demo in `addons/Cursor Trail Effect(1)` is untouched.

If you'd like the `mouse-trail.js` file fully deleted from the repo, let me know and I can remove it (or move it to the addons folder) to keep the history clean.