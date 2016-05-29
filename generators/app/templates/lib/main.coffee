{CompositeDisposable} = require 'atom'

module.exports =
  subscriptions: null

  activate: (state) ->
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', '<%= packageName %>:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->
    console.log '<%= packageName %> is serialize!'

  toggle: ->
    console.log '<%= packageName %> was toggled!'
