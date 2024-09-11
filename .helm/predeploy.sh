#!/bin/bash

THIS=`readlink -f "${BASH_SOURCE[0]}"`
DIR=`dirname "${THIS}"`
if [ "$ENVNAME" = "dev" ]; then
    kubectl --kubeconfig=$KUBECONFIG create ns $NAMESPACE-$ENVNAME
    cat <<EOF | kubectl -n $NAMESPACE-$ENVNAME apply -f -
kind: Secret
apiVersion: v1
metadata:
  name: id-rsa-vcs
data:
  id_rsa: $(cat ~/.ssh/id_rsa | base64 -w0)
type: Opaque
EOF
fi
