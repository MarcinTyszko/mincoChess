#!/usr/bin/env bash
#
# Sets KEY=VALUE pairs in an env file, in place and idempotently.
#
#   scripts/set-env-var.sh .env NODE_ENV=production ORIGIN=https://example.com
#
# An existing definition is rewritten where it stands and a missing one is
# appended, so comments, secrets and hand-tuned values in the file survive.
#
# This exists because .env is not tracked: the deployment's identity (which
# URLs it answers on, whether it is a production build) has to be applied to
# whatever file is already sitting on the host, without touching the rest.

set -euo pipefail

if [ "$#" -lt 2 ]; then
    echo "usage: $0 <env-file> KEY=VALUE [KEY=VALUE ...]" >&2
    exit 2
fi

env_file=$1
shift

[ -f "$env_file" ] || : > "$env_file"

for pair in "$@"; do
    case "$pair" in
        *=*) ;;
        *) echo "not a KEY=VALUE pair: $pair" >&2; exit 2 ;;
    esac

    key=${pair%%=*}
    value=${pair#*=}

    tmp=$(mktemp)

    # Rewrite the first definition in place; if there was none, append.
    # Later duplicates are dropped - dotenv keeps the last one it reads,
    # so leaving them would silently undo the value just written.
    awk -v key="$key" -v value="$value" '
        $0 ~ "^[[:space:]]*"key"[[:space:]]*=" {
            if (!seen++) print key "=" value
            next
        }
        { print }
        END { if (!seen) print key "=" value }
    ' "$env_file" > "$tmp"

    # The file holds secrets, so keep its permissions rather than inheriting
    # whatever mktemp chose
    chmod --reference="$env_file" "$tmp" 2>/dev/null || true

    mv "$tmp" "$env_file"
done
