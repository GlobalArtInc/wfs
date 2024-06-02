#!/bin/bash
secrets=$(find -name "secrets-*.yaml" -type f)

for absolute_path in $secrets; do
    relative_path=$(basename "$absolute_path")
    werf helm secret values encrypt $relative_path -o ../$relative_path --dir ../../
done