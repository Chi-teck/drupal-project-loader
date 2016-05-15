var request = require('request');
var parseString = require('xml2js').parseString;
var logger = require('./logger');
var url = 'https://updates.drupal.org/release-history/project-list/all';

module.exports = function (version, callback) {

  console.log('Loading project index...'.yellow);

  request(url, function (error, response, body) {

    console.log('Processing project index...'.yellow);

    if (error) throw error;
    if (response.statusCode == 200) {

      // var projects = ['views', 'pathauto', 'double_field', 'admin_menu', 'link'];
      // callback(projects);
      // return;

      var projects = [];
      parseString(body, function (err, result) {
        result.projects.project.forEach(function (value, index) {
          // Filter projects by API version. It will also exclude sandbox projects.
          if (value.api_versions && value.api_versions[0].api_version.indexOf(version) != -1) {
            projects.push(value.short_name[0]);
          }
        });

        callback(projects);
      });

    }
    else {
      logger.error('Could not download project index.');
    }
  });

};
