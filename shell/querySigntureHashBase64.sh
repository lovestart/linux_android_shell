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

echo "请输入签名文件路径"
while true; do
    read -e file_path
    if [ -e "$file_path" ] && [ -f "$file_path" ]; then
        break
    elif [ -e "$file_path" ] && [ -d "$file_path" ]; then
    	echo "请输入签名文件路径，输入的是文件夹并非签名文件$file_path"
    elif [ -n "$file_path" ]; then
    	echo "请输入签名文件路径，文件不存在$file_path"
    else
    	echo "请输入签名文件路径"
    fi
done

echo "alias=$alias store_password=$store_password file_path=$file_path"
keytool -exportcert -alias "$alias" -keystore "$file_path" -storepass "$store_password" | openssl sha1 -binary | openssl base64