FROM cloudfoundry/cflinuxfs3

RUN apt-get update
RUN apt-get install -y libboost-program-options-dev

WORKDIR /app/sbwcli

CMD rm -rf webbuild && cmake -S . -Bwebbuild && cmake --build webbuild

# Build like this:
# cd cli
# docker run --rm -v $(pwd):/app/sbwcli sbw2csv-builder:latest
