#!/usr/bin/env bash
set -e

cd "$HOME"

if command -v apt > /dev/null 2>&1; then
    APT=apt;
else
    APT=yum;
fi

sudo $APT update
sudo $APT install -y curl zip unzip git

# 安装android命令行工具
curl -O https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip
unzip commandlinetools-linux-10406996_latest.zip

# 安装jdk17
sudo $APT install -y openjdk-17-jdk
java_dir=$(find /usr/lib/jvm -maxdepth 1 -type d -name 'java-17-openjdk-*' | head -n 1)

java_content="JAVA_HOME=$java_dir
export JAVA_HOME
PATH=\$PATH:\$JAVA_HOME/bin
export PATH"


android_content='ANDROID_HOME=/root/cmdline-tools
export ANDROID_HOME
PATH=$PATH:$ANDROID_HOME/bin
export PATH'

echo -e "\n$java_content" >> /root/.bashrc
echo -e "\n$android_content" >> /root/.bashrc

echo "环境变量已添加到 /root/.bashrc。"
echo "运行 'source /root/.bashrc' 使其生效。"
echo "运行 'yes | sdkmanager --sdk_root=$ANDROID_HOME --licenses' 同意sdkmanager的服务协议。"

