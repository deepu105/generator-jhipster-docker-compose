'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var shelljs = require('shelljs');

module.exports = yeoman.generators.Base.extend({
    initializing: {
        findJhipsterApps: function () {
            var files = shelljs.ls('-l',this.destinationRoot());
            this.apps = [];
            files.forEach(function(file) {
                if(file.isDirectory()) {
                    if(shelljs.test('-f', file.name + '/.yo-rc.json')) {
                        this.apps.push(file.name.match(/([^\/]*)\/*$/)[1]);
                    }
                }
            }, this);
        }
    },

    prompting: {
        askForApps: function () {
            var done = this.async();

            // Have Yeoman greet the user.
            this.log(yosay(
                'Welcome to the first-rate ' + chalk.red('generator-docker-jhipster') + ' generator!'
            ));

            var prompts = [{
                type: 'checkbox',
                name: 'chosenApps',
                message: 'Which applications do you want in your DockerFile ?',
                choices: this.apps
            }];

            this.prompt(prompts, function (props) {
                this.apps = props.chosenApps;

                done();
            }.bind(this));
        },

        askForElk: function () {
            var done = this.async();

            var prompts = [{
                type: 'confirm',
                name: 'elk',
                message: 'Do you want ELK to monitor your applications ?',
                default: true
            }];

            this.prompt(prompts, function (props) {
                this.useElk = props.elk;

                done();
            }.bind(this));
        }
    },

    writing: function () {
        this.template('_docker-compose.yml', 'docker-compose.yml');
    }
});
