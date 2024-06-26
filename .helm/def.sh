export TAG=1.001
export APPNAME=wfs
export NAMESPACE=wfs

function dev()
{
    export ENVNAME=dev
    export CI_URL=wfs.local
    export CI_API_URL=api.wfs.local
}

function prod()
{
    export ENVNAME=prod
    export CI_URL=wfs.globalart.dev
    export CI_API_URL=wfs.globalart.dev
}

function stage()
{
    export ENVNAME=stage
    export CI_URL=wfs.glbart.dev
    export CI_API_URL=wfs.glbart.dev
}
