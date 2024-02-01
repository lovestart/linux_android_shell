#!/bin/bash
set -e

if dpkg -l | grep -q "docker"; then
    echo "Docker 已安装"
else
  # Add Docker's official GPG key:
  sudo apt-get update
  sudo apt-get install ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  # Add the repository to Apt sources:
  echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update

  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  sudo docker run --rm hello-world
fi


# 创建一个文件夹共享给模拟器
scrcpy_dir="/home/ubuntu/apk"
if [ ! -d "$scrcpy_dir" ]; then
  mkdir -p "$scrcpy_dir"
fi
# 安装scrcpy用来远程控制模拟器
if ! docker ps -a --format '{{.Names}}' | grep -q "ws-scrcpy"; then
  docker run -it -v /home/ubuntu/apk:/apk --name ws-scrcpy -d -p 8000:8000 scavin/ws-scrcpy
else
  docker restart ws-scrcpy
fi

apt install linux-modules-extra-`uname -r`
modprobe binder_linux devices="binder,hwbinder,vndbinder"
# modprobe ashmem_linux

if ! docker ps -a --format '{{.Names}}' | grep -q "redroid11"; then
  docker run -itd --privileged \
    -v ~/data11:/data \
    -p 5555:5555 \
    --name redroid11 \
    redroid/redroid:11.0.0-latest
else
  docker restart redroid11
fi



connected=false
counter=1
while [ $counter -le 10 ]
do
    deviceIp=$(docker exec redroid11 ifconfig eth0 | grep "inet " | awk -F '[: ]+' '{print $4}')
    result=$(docker exec ws-scrcpy adb connect "$deviceIp:5555")
    if [ -z "$(echo "$result" | grep "connected")" ]; then
        echo "连接失败：$result"
    else
        echo "成功连接！"
        connected=true
        break
    fi
    counter=$((counter + 1))
    sleep 1
done

if [ "$connected" = false ]; then
    echo "无法连接到设备。"
    exit 1
fi

serverIp=$(curl -s ifconfig.me)
echo "浏览器打开'$serverIp:8000'查看设备列表"
echo "打不开请联系运维打开8000端口"