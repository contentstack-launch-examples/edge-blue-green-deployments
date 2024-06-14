[![Contentstack Logo](/public/contentstack-readme-logo.png)](https://www.contentstack.com/)

## Context
This repo contains a sample implementation of blue green deployments using contentstack launch edge function.

## Implementation
There are two branches in this repo, green and blue.

Each of the branch is deployed on [Contentstack Launch](https://www.contentstack.com/docs/developers/launch) as a seperate environment.

[Launch Edge Function](https://www.contentstack.com/docs/developers/launch/edge-functions) at `/functions/[proxy].edge.js` is used to switch to a particular deployment randomly.

You can access the website [here](https://edge-blue-green.contentstackapps.com/). On each refresh the website should randomly either turn blue or green.
