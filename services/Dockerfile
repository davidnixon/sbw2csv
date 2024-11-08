FROM registry.access.redhat.com/ubi8/ubi-init:latest as builder
WORKDIR /home
RUN dnf install -y cmake libstdc++-devel gcc-c++ glib2-devel && \
    curl --output boost_1_82_0.tar.gz https://archives.boost.io/release/1.82.0/source/boost_1_82_0.tar.gz && \
    tar -xf boost_1_82_0.tar.gz && \
    cd boost_1_82_0 && \
    ./bootstrap.sh && \
    ./b2 install --with-program_options --prefix=/home/boost

COPY cli/ /home/cli/
WORKDIR /home/cli/
RUN cmake -Bbuild . && \
    cmake --build build/

FROM registry.access.redhat.com/ubi8/nodejs-16-minimal as runner
USER root
COPY --from=builder /home/boost /home/boost
COPY --from=builder /home/cli/build/sbw2csv /opt/app-root/src/cli/build/sbw2csv
COPY . /opt/app-root/src/
WORKDIR /opt/app-root/src
RUN mkdir -p /.npm-global/bin/ && \
    npm install --prefix /.npm-global -g yarn && \
    export PATH=$PATH:/opt/app-root/src/.npm-global/bin && \
    mkdir -p /opt/app-root/src/routes/uploads && \
    mkdir -p /opt/app-root/src/routes/converted && \
    chmod 777 /opt/app-root/src/routes/uploads && \
    chmod 777 /opt/app-root/src/routes/converted && \
    npm i -g yarn && \
    yarn install --production && \
    chown -R 1024:0 /opt/app-root/src
USER 1024
ENV PORT=8080
ENV NODE_ENV=production
ENTRYPOINT yarn start