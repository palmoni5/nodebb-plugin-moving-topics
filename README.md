# NodeBB Plugin: Moving Topics for Owners

Allow topic owners to move their own topics between categories, without granting full moderation privileges.

## Features

- Adds **Move** to the thread tools for the topic owner.
- Owners can move **only their own topics**.
- Moves are blocked for **locked** or **deleted** topics.
- Target categories are filtered by `topics:create` + `topics:read`.
- Admins/moderators retain existing move permissions.
- Optional limit by number of posts in the topic (default: 5).

## Requirements

- NodeBB (compatible with current core API used by this plugin)

## Installation

### Via NodeBB CLI

```powershell
cd /path/to/nodebb
./nodebb install nodebb-plugin-moving-topics
```

### Manual

```powershell
cd /path/to/nodebb
npm install nodebb-plugin-moving-topics
```

Then rebuild and restart:

```powershell
./nodebb build
./nodebb restart
```

## Configuration

Admin control panel: `/admin/settings/post`

- **Maximum posts to allow owner moves** (`movingTopicsMaxPosts`)
  - Default: `5`
  - Set to `0` for no limit

## Usage

For topic owners, the **Move** option appears in the thread tools menu. Choose a destination category and confirm.

## License

MIT
