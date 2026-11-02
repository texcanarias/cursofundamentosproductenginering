#!/usr/bin/env bash
set -e
npm run build
npx tsc -p back/tsconfig.vercel.json
echo '{"name":"back-vercel","version":"1.0.0","private":true}' > back/dist-vercel/package.json
rm -rf api/_backend
cp -r back/dist-vercel/src api/_backend
echo '{"name":"backend","version":"1.0.0","private":true}' > api/_backend/package.json
