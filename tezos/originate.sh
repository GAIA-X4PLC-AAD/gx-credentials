#!/bin/bash
INITIAL=$(ligo compile storage -m GXCRegistry ./GXCRegistry.jsligo "$(cat ./storage)")
octez-client originate contract gxcregistry \
  transferring 0 from "$1" \
  running gxcregistry.tz \
  --init "$INITIAL" --burn-cap 0.5
