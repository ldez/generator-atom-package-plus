'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
var extend = _.merge;
var mkdirp = require('mkdirp');
var parseAuthor = require('parse-author');
var githubUsername = require('github-username');

function makeGeneratorName(name) {
  name = _.kebabCase(name);
  name = name.indexOf('atom-') === 0 ? name : 'atom-' + name;
  return name;
}

module.exports = yeoman.Base.extend({

  prompting: {

    askFor: function() {
      var prompts = [{
        type: 'input',
        name: 'name',
        message: 'Your Atom package name',
        // Default to current folder name
        default: makeGeneratorName(this.appname),
        filter: makeGeneratorName,
        validate: function(str) {
          return str.length > 0;
        }
      }, {
        type: 'input',
        name: 'description',
        message: 'Describe your package in one-line:',
        default: 'My awesome atom package!'
      }, {
        name: 'authorName',
        message: 'Author\'s Name',
        default: this.user.git.name(),
        validate: function(str) {
          return str.length > 0;
        }
      }, {
        name: 'authorEmail',
        message: 'Author\'s Email',
        default: this.user.git.email(),
        validate: function(str) {
          return str.length > 0;
        }
      }, {
        name: 'authorUrl',
        message: 'Author\'s Homepage',
      }, {
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        filter: function(words) {
          return words.split(/\s*,\s*/g);
        }
      }, {
        type: 'checkbox',
        name: 'features',
        message: 'Are you using?',
        choices: [{
          name: 'Grammars',
          value: 'grammars',
          checked: false
        }, {
          name: 'Keymaps',
          value: 'keymaps',
          checked: false
        }, {
          name: 'Menus',
          value: 'menus',
          checked: false
        }, {
          name: 'Settings',
          value: 'settings',
          checked: false
        }, {
          name: 'Snippets',
          value: 'snippets',
          checked: false
        }, {
          name: 'StyleSheets',
          value: 'styles',
          checked: false
        }]
      }];

      return this.prompt(prompts).then(function(props) {
        this.props = extend(this.props, props);
      }.bind(this));
    },

    askForGithubAccount: function() {
      var done = this.async();

      githubUsername(this.props.authorEmail, function(err, username) {
        if (err) {
          username = username || '';
        }
        this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          default: username,
          validate: function(str) {
            return str.length > 0;
          }
        }).then(function(prompt) {
          this.props.githubAccount = prompt.githubAccount;
          done();
        }.bind(this));
      }.bind(this));
    }
  },

  configuring: function() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  default: function() {
    this.composeWith('node:editorconfig', {}, {
      local: require('generator-node').editorconfig
    });
    this.composeWith('node:git', {
      options: {
        name: this.props.name,
        githubAccount: this.props.githubAccount
      }
    }, {
      local: require('generator-node').git
    });
    this.composeWith('license', {
      options: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        website: this.props.authorUrl
      }
    }, {
      local: require.resolve('generator-license/app')
    });
  },

  writing: function() {
    var staticFiles = [
      '.coffeelintignore',
      '.gitignore',
      '.travis.yml',
      'appveyor.yml',
      'coffeelint.json'
    ]
    staticFiles.forEach(function(file) {
      this.fs.copy(
        this.templatePath(file),
        this.destinationPath(file)
      );
    }, this);

    // Update package.json`
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    var pkg = extend({
      name: _.kebabCase(this.props.name).replace('atom-', ''),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      main: 'lib/main',
      keywords: [],
      engines: {
        atom: ">=1.0.0 <2.0.0"
      },
      devDependencies: {
        coffeelint: "^1.15.0"
      }
    }, currentPkg);

    // Combine the keywords
    if (this.props.keywords) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
    }

    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copy(
      this.templatePath('.github/CONTRIBUTING.md'),
      this.destinationPath('.github/CONTRIBUTING.md')
    );
    this.fs.copy(
      this.templatePath('.github/ISSUE_TEMPLATE.md'),
      this.destinationPath('.github/ISSUE_TEMPLATE.md')
    );
    this.fs.copyTpl(
      this.templatePath('.github/PULL_REQUEST_TEMPLATE.md'),
      this.destinationPath('.github/PULL_REQUEST_TEMPLATE.md'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('readme.md'),
      this.destinationPath('readme.md'),
      this.props
    );

    var baseFilename = this.props.name.replace('atom-', '')
    this.fs.copyTpl(
      this.templatePath('lib/main.coffee'),
      this.destinationPath('lib/main.coffee'), {
        packageName: baseFilename
      }
    );
    this.fs.copyTpl(
      this.templatePath('spec/package-spec.coffee'),
      this.destinationPath('spec/package-spec.coffee'), {
        packageName: baseFilename
      }
    );
    if (_.includes(this.props.features, 'grammars')) {
      this.fs.copyTpl(
        this.templatePath('grammars/package.cson'),
        this.destinationPath('grammars/package-' + baseFilename + '.cson'), {
          scopeName: baseFilename.replace('-', '.')
        }
      );
    }
    if (_.includes(this.props.features, 'keymaps')) {
      this.fs.copyTpl(
        this.templatePath('keymaps/package.cson'),
        this.destinationPath('keymaps/package-' + baseFilename + '.cson'), {
          packageName: baseFilename
        }
      );
    }
    if (_.includes(this.props.features, 'menus')) {
      this.fs.copyTpl(
        this.templatePath('menus/package.cson'),
        this.destinationPath('menus/package-' + baseFilename + '.cson'), {
          packageName: baseFilename
        }
      );
    }
    if (_.includes(this.props.features, 'settings')) {
      this.fs.copyTpl(
        this.templatePath('settings/package.cson'),
        this.destinationPath('settings/package-' + baseFilename + '.cson'), {
          scopeName: baseFilename.replace('-', '.')
        }
      );
    }
    if (_.includes(this.props.features, 'snippets')) {
      this.fs.copyTpl(
        this.templatePath('snippets/package.cson'),
        this.destinationPath('snippets/package-' + baseFilename + '.cson'), {
          scopeName: baseFilename.replace('-', '.')
        }
      );
    }
    if (_.includes(this.props.features, 'styles')) {
      this.fs.copyTpl(
        this.templatePath('styles/package.less'),
        this.destinationPath('styles/package-' + baseFilename + '.less'), {
          packageName: baseFilename
        }
      );
    }
  },

  install: function() {
    this.runInstall('apm');
  },

  end: function() {
    this.log('\n' + chalk.yellow('Edit readme.md:'));
    this.log(chalk.yellow('- change ADD_YOUR_ID in the AppVeyor badge.'));
    this.log(chalk.yellow('- change YOUR_LICENSE in the License badge.'));
  }

});
