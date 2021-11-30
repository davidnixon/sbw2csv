FROM registry.access.redhat.com/ubi8/nginx-120
COPY ce/dist /opt/app-root/src
RUN mkdir /opt/app-root/etc/templates
COPY ce/nginx-default-cfg/*.conf /opt/app-root/etc/templates/
COPY ce/nginx-start/*.sh /opt/app-root/src/nginx-start/
CMD /usr/libexec/s2i/run