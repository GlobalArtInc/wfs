#!/bin/bash

THIS=`readlink -f "${BASH_SOURCE[0]}"`
DIR=`dirname "${THIS}"`
cd $DIR

source ./def.sh

if [ "$ENVNAME" = "dev" ]; then
    export IS_DEV_ENV=true;

    NAMESPACE="$NAMESPACE-$ENVNAME"
    # echo "Waiting for pods..."
    kubectl -n $NAMESPACE wait --for=condition=ready --timeout=120s pods wfs-api-0
    kubectl -n $NAMESPACE wait --for=condition=ready --timeout=120s pods wfs-discord-0

    echo "  ====================  "
    echo "    The environment is configured =) "
    echo "    To run the entire system, you need to inside the pod in the /workspace/wfs folder"
    echo "   "
    echo "      npm run start:dev"
    echo "   "
    echo "   After running the command, you can go to http://wfs.local/swagger/"
    echo ""
    echo "  ====================  "
fi

if [ "$ENVNAME" = "stage" ]; then
    export IS_STAGE_ENV=true;
fi