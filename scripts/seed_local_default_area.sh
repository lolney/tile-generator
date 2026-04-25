#!/usr/bin/env sh
set -eu

# Fast development wrapper around the global substitute-data pipeline.

DATA_DIR="${1:-data}" \
BBOX="${BBOX:--121.5 36.75 -119.5 38.25}" \
TARGET_RES="${TARGET_RES:-0.0025}" \
  ./scripts/seed_substitute_rasters.sh
