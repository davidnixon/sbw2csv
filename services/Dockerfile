FROM docker.io/centos:centos8
RUN dnf install -y cmake  boost-devel libstdc++-devel gcc-c++ glib2-devel
COPY cli/ /home/cli/
WORKDIR /home/cli/
RUN cmake -DBOOSTPO=/usr/lib64/libboost_program_options.so -Bbuild .
RUN cmake --build build/

FROM registry.access.redhat.com/ubi8/nodejs-14-minimal
USER root
COPY --from=0 /usr/lib64/libboost* /usr/lib64/
COPY --from=0 /home/cli/build/sbw2csv /opt/app-root/src/sbw2csv
RUN mkdir -p /.npm-global/bin/
RUN npm install --prefix /.npm-global -g yarn
RUN export PATH=$PATH:/opt/app-root/src/.npm-global/bin
COPY . /opt/app-root/src/
USER default