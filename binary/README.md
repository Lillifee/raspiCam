# binary

GitHub does not have an armv7 32bit runner to build the epoll library. epoll is in use by onoff to listen to file changes

One way could be a self-hosted runner or precompiled binaries.
For now, I build the epoll library on my raspberry pi and override the epoll.node after the build:server step in package.json.

## build epoll

The easiest way to build the epoll is to run the npm install command on the <b>raspberry pi</b>

`npm install epoll`

The epoll.node build into the
./node_modules/epoll/build/Release/epoll.node
