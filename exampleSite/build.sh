#!/bin/sh
# Cloudflare Pages build for the demo site, run from the repository root.
#   Build command:          sh exampleSite/build.sh
#   Build output directory: exampleSite/public
# Production (master) builds for the configured baseURL; preview
# deployments build for their own *.pages.dev address.
set -eu

if [ "${CF_PAGES_BRANCH:-master}" = "master" ]; then
  hugo --minify -s exampleSite --cleanDestinationDir
else
  hugo --minify -s exampleSite --cleanDestinationDir --baseURL "$CF_PAGES_URL/"
fi

node tools/protect/seal.mjs exampleSite/public
node tools/protect/verify.mjs exampleSite/public
