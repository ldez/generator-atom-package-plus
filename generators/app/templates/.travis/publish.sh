#!/bin/bash
## version 1.0.0
## author: Ludovic Fernandez (@ldez/@ludnadez)

set -e

## Custom variables
USER_EMAIL="<%= authorEmail %>"
USER_NAME="<%= authorName %>"
GIT_REPOSITORY='git@github.com:<%= githubAccount %>/<%= name %>.git'
SSH_KEY_NAME="travis_rsa"
AUTHORIZED_BRANCH='master'
PUBLISH_TYPE=${PUBLISH_TYPE:="patch"}

## Fix apm path to the Atom stable channel
APM_SCRIPT_PATH=${APM_SCRIPT_PATH:="$HOME/atom/usr/bin/apm"}

cd "$TRAVIS_BUILD_DIR"

## Prevent publish on tags
CURRENT_TAG=$(git tag --contains HEAD)

if [ -n "${PUBLISH}" ] && [ "$TRAVIS_OS_NAME" = "linux" ] && [ "$ATOM_CHANNEL" = "stable" ] && [ "$TRAVIS_BRANCH" = "$AUTHORIZED_BRANCH" ] && [ -z "$CURRENT_TAG" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo 'Publishing...'
else
  echo 'Skipping publishing'
  exit 0
fi

## Git configuration
git config --global user.email "${USER_EMAIL}"
git config --global user.name "${USER_NAME}"

## Loading SSH key
echo "Loading key..."
## TODO you must change `$encrypted_xxxx_key` and `$encrypted_xxxx_iv`
openssl aes-256-cbc -K "$encrypted_xxxx_key" -iv "$encrypted_xxxx_iv" -in .travis/${SSH_KEY_NAME}.enc -out ~/.ssh/${SSH_KEY_NAME} -d
eval "$(ssh-agent -s)"
chmod 600 ~/.ssh/${SSH_KEY_NAME}
ssh-add ~/.ssh/${SSH_KEY_NAME}

## Change origin url to use SSH
git remote set-url origin "${GIT_REPOSITORY}"

## Force checkout master branch (because Travis uses a detached head)
git checkout ${AUTHORIZED_BRANCH}

## Publish
"$APM_SCRIPT_PATH" login --token "${ATOM_ACCESS_TOKEN}"
"$APM_SCRIPT_PATH" publish "${PUBLISH_TYPE}"
