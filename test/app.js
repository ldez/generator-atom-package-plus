'use strict';
var path = require('path');
var mockery = require('mockery');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-atom-package-plus:app', function() {

  before(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('npm-name', function() {
      return Promise.resolve(true);
    });

    mockery.registerMock('github-username', function(name, cb) {
      cb(null, 'unicornUser');
    });

    mockery.registerMock(
      require('generator-node').git,
      helpers.createDummyGenerator()
    );

    mockery.registerMock(
      require('generator-node').editorconfig,
      helpers.createDummyGenerator()
    );

    mockery.registerMock(
      require.resolve('generator-license/app'),
      helpers.createDummyGenerator()
    );
  });

  after(function() {
    mockery.disable();
  });

  describe('running on new project', function() {

    before(function() {
      this.answers = {
        name: 'atom-generator-test',
        description: 'My package',
        authorName: 'Me',
        authorEmail: 'me@me.com',
        authorUrl: 'http://fakeurl.com',
        keywords: ['foo', 'bar'],
        features: ['grammars', 'keymaps', 'menus', 'settings', 'snippets', 'styles'],
        githubAccount: 'fake'
      };
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts(this.answers)
        .toPromise();
    });

    it('creates files', function() {
      assert.file([
        'readme.md',
        '.coffeelintignore',
        '.gitignore',
        '.travis.yml',
        'appveyor.yml',
        'coffeelint.json',
        'package.json',
        '.github/CONTRIBUTING.md',
        '.github/ISSUE_TEMPLATE.md',
        '.github/PULL_REQUEST_TEMPLATE.md',
        '.travis/publish.sh',
        'lib/main.coffee',
        'spec/package-spec.coffee',
        'grammars/package-generator-test.cson',
        'keymaps/package-generator-test.cson',
        'menus/package-generator-test.cson',
        'settings/package-generator-test.cson',
        'snippets/package-generator-test.cson',
        'styles/package-generator-test.less'
      ]);
    });

    it('creates package.json', function() {
      assert.file('package.json');
      assert.jsonFileContent('package.json', {
        name: 'generator-test',
        version: '0.0.0',
        description: this.answers.description,
        homepage: this.answers.homepage,
        engines: {
          atom: ">=1.0.0 <2.0.0"
        },
        author: {
          name: this.answers.authorName,
          email: this.answers.authorEmail,
          url: this.answers.authorUrl
        },
        keywords: this.answers.keywords,
        main: 'lib/main'
      });
    });

    it('creates and fill contents in PULL_REQUEST_TEMPLATE.md', function() {
      assert.file('.github/PULL_REQUEST_TEMPLATE.md');
      assert.fileContent('.github/PULL_REQUEST_TEMPLATE.md', '- Read the [contributing guide](https://github.com/fake/atom-generator-test/blob/master/.github/CONTRIBUTING.md).');
    });

  });

  describe('running on new project without features', function() {

    before(function() {
      this.answers = {
        name: 'atom-generator-test',
        description: 'My package',
        authorName: 'Me',
        authorEmail: 'me@me.com',
        authorUrl: 'http://fakeurl.com',
        keywords: ['foo', 'bar'],
        features: [],
        githubAccount: 'fake'
      }
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts(this.answers)
        .toPromise();
    });

    it('creates files', function() {
      assert.file([
        'readme.md',
        '.coffeelintignore',
        '.gitignore',
        '.travis.yml',
        'appveyor.yml',
        'coffeelint.json',
        'package.json',
        '.github/CONTRIBUTING.md',
        '.github/ISSUE_TEMPLATE.md',
        '.github/PULL_REQUEST_TEMPLATE.md',
        '.travis/publish.sh',
        'lib/main.coffee',
        'spec/package-spec.coffee',
      ]);
    });

    it('creates package.json', function() {
      assert.file('package.json');
      assert.jsonFileContent('package.json', {
        name: 'generator-test',
        version: '0.0.0',
        description: this.answers.description,
        homepage: this.answers.homepage,
        engines: {
          atom: ">=1.0.0 <2.0.0"
        },
        author: {
          name: this.answers.authorName,
          email: this.answers.authorEmail,
          url: this.answers.authorUrl
        },
        keywords: this.answers.keywords,
        main: 'lib/main'
      });
    });
  });

});
