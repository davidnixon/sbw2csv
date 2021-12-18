FROM registry.access.redhat.com/ubi8/nodejs-14
USER root
RUN npm install -g yarn
COPY . .
RUN npm install -g yarn &&\
    npx browserslist@latest --update-db &&\
    yarn install &&\
    yarn build

FROM registry.access.redhat.com/ubi8/nginx-120
USER root
COPY --from=0 /opt/app-root/src/ce/dist /opt/app-root/src
RUN mkdir /opt/app-root/etc/templates
COPY ce/nginx-default-cfg/*.conf /opt/app-root/etc/templates/
COPY ce/nginx-start/*.sh /opt/app-root/src/nginx-start/
RUN chown -R 1024:0 /opt/app-root/src/
USER 1024
CMD /usr/libexec/s2i/run