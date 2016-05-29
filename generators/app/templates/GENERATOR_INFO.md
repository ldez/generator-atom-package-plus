# For generator's user

## `readme.md`

Edit `readme.md`:

- change `ADD_YOUR_ID` in the AppVeyor badge.
- change `YOUR_LICENSE` in the License badge.

## Package publising with continuous delivery

How to use [Travis CI](https://travis-ci.org) to publish package?

Every merged PR is released as a new version (by default a `patch`).

We use the [Travis CI UI](https://travis-ci.org/<%= githubAccount %>/<%= name %>/settings) to manage the publishing system via secure environment variables:

* `PUBLISH_TYPE`: default `patch`, can be change to `minor`, `major`.
* `PUBLISH`: if not defined, prevent the publishing.
* `$encrypted_xxxx_key` and `$encrypted_xxxx_iv`: defined the main key and vector to encrypt the SSH key.
* `ATOM_ACCESS_TOKEN`: defined the Atom token for `apm`.

Active continuous delivery:

* generate encrypted SSH key.
* change `$encrypted_xxxx_key` and `$encrypted_xxxx_iv` in `.travis/publish.sh`.
* add the SSH key to your Github account. (https://github.com/settings/keys)
* add `ATOM_ACCESS_TOKEN` to [Travis CI UI](https://travis-ci.org/<%= githubAccount %>/<%= name %>/settings).
