# Working with secret values

### Encryption key generating

```bash
werf helm secret generate-secret-key
```

For secret values encrypting we need encryption key. _Werf_ can read encryption key from 3 places:

1. from environment variable `WERF_SECRET_KEY`
1. from special file `.werf_secret_key`, which contains in project root directory
1. from file `~/.werf/global_secret_key` (global key)

### Secret values file encryption

Encrypt values file:

```bash
werf helm secret values encrypt test.yaml -o .helm/secret-values.yaml
```

Decrypt values file:

```bash
werf helm secret values decrypt .helm/secret-values.yaml
```

### Naming convention:

```yaml
# first-line with
---
# comments Syntax example in YAML file
value: 11
piValue: 3.14
isEnabled: false
strValue1: 'string value1'
strValue2: 'string value2'
strValue3: string value3
arrayValue:
  - 'firstValue'
  - 'secondValue'
```