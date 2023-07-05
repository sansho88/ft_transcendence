# shellcheck disable=SC2046 # Intended splitting of OPTIONS

if [ $(docker ps -a -q) ]; then
    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)
fi
if [ $(docker images -a -q) ]; then
    docker rmi $(docker images -a -q)
fi
if [ $(docker volume ls -q) ]; then
    docker volume rm $(docker volume ls -q)
fi

docker system prune -f -a --volumes



