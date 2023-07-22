#!/bin/sh

if [ -n "$(docker ps -a -q)" ]; then
    # shellcheck disable=SC2046
    docker stop $(docker ps -a -q)
    # shellcheck disable=SC2046
    docker rm $(docker ps -a -q)
fi
if [ -n "$(docker images -a -q)" ]; then
    # shellcheck disable=SC2046
    docker rmi $(docker images -a -q)
fi
if [ -n "$(docker volume ls -q)" ]; then
    # shellcheck disable=SC2046
    docker volume rm $(docker volume ls -q)
fi

docker system prune -f -a --volumes