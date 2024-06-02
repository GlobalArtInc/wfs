set -e

DIR=/workspace
cd $DIR
mkdir -p /workspace

if ! [ -d $DIR/wfs ]; then
    echo "Clone repository"
    git clone git@github.com:GlobalArtInc/warface.git
    cd $DIR/wfs
fi


if ! [ -f $DIR/.npm_i_app ]; then
    echo "Installing APP Dependencies"
    cd $DIR/wfs/app && pnpm i && \
    touch $DIR/.npm_i_app
fi
