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
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: 'atom-generator-test',
          description: 'My package',
          authorName: 'Me',
          authorEmail: 'me@me.com',
          authorUrl: 'http://fakeurl.com',
          keywords: ['foo', 'bar'],
          features: ['grammars', 'keymaps', 'menus', 'settings', 'snippets', 'styles'],
          // features: ['nothing'],
          githubAccount: 'fake'
        })
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

  });

});
