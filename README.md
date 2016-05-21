# Drupal project loader

Downloads the entire codebase for all Drupal projects.

## Installation
```bash
sudo npm install -g drupal-project-loader
```

## Usage

Options:

Long | Short | Default value |:Description
:----:|:-----:|:-------:| -----------
branch| b | 8.x | Drupal API branch (6.x, 7.x, 8.x, etc).
type  | t  | all  | Project type (module, theme, distirbution, etc).
destination | d | ./drupal-codebase-[branch] | Path to which the projects will be copied.
extract | | 1 |  Whether or not the files should be extracted (uncompressed).
concurrency | c | 50 | Number of multiple requests to perform at a time.
yes | y | 1 |  Assume 'yes' as answer to all prompts.
log-level | | warn | Loging level.

Example:
```bash
drupal-project-loader --branch=7.x --type=module --destination=/tmp/d7-modules
```

## License
GNU General Public License, version 2
