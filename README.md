# Drupal project loader

Downloads the entire codebase for all Drupal projects.

## Installation
```bash
npm install -g drupal-project-loader
```

## Usage

Options:

Long | Short | Default value |Description
:----:|:-----:|:-------:|-----------
branch| b | 8.x | Drupal API branch (6.x, 7.x, 8.x, etc).
type  | t  | module | Filter project by type (module, theme, distribution, etc). Pass to 'any' to load all project types.
destination | d | ./drupal-codebase/[branch] | Path to which the projects will be copied.
extract | e | true |  Whether or not the files should be extracted (uncompressed).
concurrency | c | 50 | Number of multiple requests to perform at a time.
yes | y | false |  Assume 'yes' as answer to all prompts.
log-level | l | warn | Loging level.
version | v | false | Output the version number.
timeout | m | 15000 | The number of milliseconds to wait for a server to send response headers.

Example:
```bash
drupal-project-loader --branch=7.x --type=theme --destination=/tmp/d7-themes --extract=0 --yes
```

## License
GNU General Public License, version 2.
