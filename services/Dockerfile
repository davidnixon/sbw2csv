FROM docker.io/centos:centos8
RUN dnf install -y cmake  boost-devel libstdc++-devel gcc-c++ glib2-devel
COPY cli/ /home/cli/
WORKDIR /home/cli/
RUN cmake -DBOOSTPO=/usr/lib64/libboost_program_options.so -Bbuild . && \
    cmake --build build/

FROM registry.access.redhat.com/ubi8/nodejs-14-minimal
USER root
COPY --from=0 /usr/lib64/libboost* /usr/lib64/
COPY --from=0 /home/cli/build/sbw2csv /opt/app-root/src/cli/build/sbw2csv
COPY . /opt/app-root/src/
WORKDIR /opt/app-root/src
RUN mkdir -p /.npm-global/bin/ && \
    npm install --prefix /.npm-global -g yarn && \
    export PATH=$PATH:/opt/app-root/src/.npm-global/bin && \
    mkdir -p /opt/app-root/src/routes/uploads && \
    mkdir -p /opt/app-root/src/routes/converted && \
    chmod 777 /opt/app-root/src/routes/uploads && \
    chmod 777 /opt/app-root/src/routes/converted && \
    yarn install --production && \
    chown -R 1024:0 /opt/app-root/src
USER 1024
ENV PORT=8080
ENV NODE_ENV=production
ENTRYPOINT yarn start