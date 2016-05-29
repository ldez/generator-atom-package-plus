# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.
describe '<%= packageName %>', ->
  pack = null

  beforeEach ->
    waitsForPromise ->
      atom.packages.activatePackage '<%= packageName %>'
        .then (p) ->
          pack = p

  it 'should load the package', ->
    expect(pack.name).toBe '<%= packageName %>'
