#!/bin/bash
secrets=$(find ../ -maxdepth 1 -name "secrets-*.yaml" -type f)

for absolute_path in $secrets; do
    relative_path=$(basename "$absolute_path")
    werf helm secret values decrypt "$absolute_path" --dir ../../ | tee "$relative_path"
done
