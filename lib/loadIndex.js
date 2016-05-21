require('colors');
var request = require('request');
var parseString = require('xml2js').parseString;
var config = require('./config');
var url = 'https://updates.drupal.org/release-history/project-list/all';

module.exports = function(callback) {

  console.log('Loading project index...'.yellow);

  request(url, function(error, response, body) {
    if (error) {
      return callback(error);
    }

    console.log('Processing project index...'.yellow);
    if (response.statusCode == 200) {

      var projects = [];
      parseString(body, function (error, result) {
        if (error) {
          return callback('Could not parse release-history file.');
        }

        result.projects.project.forEach(function(project) {

          var typeIsValid = !config.type || 'project_' + config.type == project.type[0];
          var versionIsValid = project.api_versions && project.api_versions[0].api_version.indexOf(config.branch) != -1;

          if (typeIsValid && versionIsValid) {
            projects.push(project.short_name[0]);
          }

        });

        callback(null, projects);
      });

    }
    else {
      callback('Could not download project index.');
    }
  });

};
