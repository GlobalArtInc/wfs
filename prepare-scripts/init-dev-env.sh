set -e

DIR=/workspace
cd $DIR
mkdir -p /workspace

if ! [ -d $DIR/wfs ]; then
    echo "Clone repository"
    git clone git@git.globalart.dev:globalart/wfs.git
    cd $DIR/wfs
fi


if ! [ -f $DIR/.npm_i_api ]; then
    echo "Installing API Dependencies"
    cd $DIR/wfs/api && npm i && \
    touch $DIR/.npm_i_api
fi

if ! [ -f $DIR/.npm_i_discord ]; then
    echo "Installing Discord Dependencies"
    cd $DIR/wfs/discord && npm i && \
    touch $DIR/.npm_i_discord
fi

if ! [ -f $DIR/.npm_i_tg ]; then
    echo "Installing TelegramBot Dependencies"
    cd $DIR/wfs/telegram && npm i && \
    touch $DIR/.npm_i_tg
fi

if ! [ -f $DIR/.npm_i_front ]; then
    echo "Installing Front Dependencies"
    cd $DIR/wfs/front && npm i && \
    touch $DIR/.npm_i_front
fi