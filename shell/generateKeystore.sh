#!/usr/bin/env bash
set -e

echo "请输入alias"
while true; do
    read alias
    if [ -n "$alias" ]; then
        break
    else
    	echo "请输入alias"
    fi
done

echo "请输入StorePassword"
while true; do
    read store_password
    if [ -n "$store_password" ]; then
        break
    else
    	echo "请输入storePassword"
    fi
done

echo "请输入KeyPassword，不输默认和Password相同"
while true; do
    read key_password
    if [ -n "$key_password" ]; then
   		break
    else
    	key_password="$store_password"
   		break
    fi
done

echo "请输入文件名，可以指定路径"
while true; do
    read -e file_path
    if [ -e "$file_path" ] && [ -f "$file_path" ]; then
        echo "请输入文件名，可以指定路径，文件已存在$file_path"
    elif [ -n "$file_path" ]; then
        break
    else
    	echo "请输入文件名，可以指定路径"
    fi
done

echo "即将执行的命令"
echo "-----------------------"
echo "keytool -genkeypair -v -alias $alias -keyalg RSA -keysize 2048 -validity 36500 -keypass $key_password -keystore $file_path -storepass $store_password"
echo "-----------------------"
echo "确认执行输入yes"
read confirm
if [ "$confirm" = "yes" ]; then
    echo "开始执行命令"    
else
    echo "停止执行命令"
    exit 1
fi
keytool -genkeypair -v -alias "$alias" -keyalg RSA -keysize 2048 -validity 36500 -keypass "$key_password" -keystore "$file_path" -storepass "$store_password"
