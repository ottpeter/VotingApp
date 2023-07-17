
Will install both node_modules folders: `npm run install`
Will copy artifacts to src folder after compiling : `npm run build`

`removeExpired()` is currently not connected to the front end, it would be reasonable to periodically call removeExpired() from the back end, to keep it up to date.
Front end will need to check if a poll expired or not, before displaying.
