#!/bin/bash

docker run -it --rm --name client -e CHECK="TRUE" -v ./client:/app client:nightly 
