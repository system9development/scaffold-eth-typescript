#!/usr/bin/env bash

set -a
. .env
set +a

export TAGS=core
if [[ ${HARDHAT_TARGET_NETWORK} =~ ^(localhost|gorli|hardhat)$ ]]; then
  export TAGS=core,underlyings 
fi

yarn contracts:deploy
