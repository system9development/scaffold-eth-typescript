#!/usr/bin/env bash

set -a
. .env
set +a

export TAGS=core,dammtroller
if [[ ${HARDHAT_TARGET_NETWORK} =~ ^(localhost|gorli|hardhat)$ ]]; then
  export TAGS=core,underlyings,dammtroller
fi

yarn contracts:deploy
