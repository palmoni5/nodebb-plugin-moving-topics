# nodebb-plugin-moving-topics

Plugin for NodeBB that allows topic owners to move their own topics to another category.

## What it does

- Adds a **Move** option in the thread tools for topic owners.
- Allows owners to move **only their own topics**.
- Prevents moves when the topic is **locked** or **deleted**.
- Requires the owner to have `topics:create` and `topics:read` in the target category.

## Install

This plugin was created directly in your NodeBB `node_modules` folder.
To activate it:

```powershell
Set-Location C:\Users\Public\NodeBB
.\nodebb activate nodebb-plugin-moving-topics
.\nodebb build
.\nodebb restart
```

(If your CLI is `nodebb.bat`, replace accordingly.)

## Notes

- The move dialog uses the same category selector, but the list is filtered by `topics:create`.
- Admins/moderators keep their existing move privileges.

## Files

- `library.js` – server-side privilege and move logic
- `static/lib/client.js` – client-side menu item + selector tweak
- `plugin.json` – NodeBB hook registration
- `package.json` – package metadata

## Troubleshooting

- If activation fails with “plugin not installed”, make sure the folder name is exactly `nodebb-plugin-moving-topics`.
- After changes, always run `nodebb build` and restart.
