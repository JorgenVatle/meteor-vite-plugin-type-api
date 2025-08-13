#!/usr/bin/env bash
# shellcheck disable=SC2329

set -e

PROJECT_NAME="$(basename "$(realpath .)")"
OUT_DIR="/tmp/meteor-build/$PROJECT_NAME"

# Store local Meteor files outside of the project root to avoid performance
# issues with file watchers and IDE indexing.
export METEOR_LOCAL_DIR="/tmp/.meteor-local/$PROJECT_NAME"

# -- [Production Commands] ----------------------------------------------------
production() {

    # Build Meteor app for production
    build() {
        meteor build --directory "$OUT_DIR"
    }

    # Install npm dependencies for the Meteor production bundle
    # This needs to be done before starting the production server
    finalize() {
        cd "$OUT_DIR/bundle/programs/server"
        npm i
    }

    # Start the Meteor production server
    start() {
        local METEOR_SETTINGS

        METEOR_SETTINGS="$(cat settings.json)"

        export METEOR_SETTINGS

        node "$OUT_DIR/bundle/main.js"
    }

    loadEnvFile .env.production
    "$subCommand" "${@:2}"
}



# -- [Development Commands] ---------------------------------------------------
development() {

    # Start Meteor app in development mode
    start() {
        meteor run --settings settings.json "$@"
    }

    loadEnvFile .env.development
    "$subCommand" "${@:2}"
}



# -- [Internal functions] -----------------------------------------------------
loadEnvFile() {
    local fileName="$1"

    if [ -f "$fileName" ]; then
        # shellcheck disable=SC2046
        export $(grep -v '^#' "$fileName" | xargs)
        echo "ℹ️  Loaded env file: $fileName"
        echo ""
    fi
}



# -----------------------------------------------------------------------------

command="$1"
subCommand="$2"


if [[ -z $command ]]; then
    echo "No command specified!"
    exit 1
fi

if [[ -z $subCommand ]]; then
    echo "No subCommand specified!"
    exit 1
fi

echo "[app.sh]"
echo "$ $*"

loadEnvFile .env

"$command" "$subCommand" "${@:3}"