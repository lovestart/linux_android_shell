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

echo "请输入pepk.jar路径"
while true; do
    read -e pepk_path
    if [ -e "$pepk_path" ] && [ -f "$pepk_path" ]; then
        break
    elif [ -e "$pepk_path" ] && [ -d "$pepk_path" ]; then
    	echo "请输入pepk.jar路径，输入的是文件夹并非pepk.jar文件$pepk_path"
    elif [ -n "$pepk_path" ]; then
    	echo "请输入pepk.jar路径，文件不存在$pepk_path"
    else
    	echo "请输入pepk.jar路径"
    fi
done

echo "请输入加密公钥路径"
while true; do
    read -e encrypt_path
    if [ -e "$encrypt_path" ] && [ -f "$encrypt_path" ]; then
        break
    elif [ -e "$encrypt_path" ] && [ -d "$encrypt_path" ]; then
    	echo "请输入加密公钥路径，输入的是文件夹并非加密公钥文件$encrypt_path"
    elif [ -n "$encrypt_path" ]; then
    	echo "请输入加密公钥路径，文件不存在$encrypt_path"
    else
    	echo "请输入加密公钥路径"
    fi
done

echo "请输入生成output.zip路径,不输默认在当前路径下生成output.zip"
while true; do
    read -e output_path
    if [ -z "$output_path" ]; then
    	output_path="output.zip"
    fi
    if [ -e "$output_path" ] && [ -f "$output_path" ]; then
        echo "请输入生成output.zip路径，文件已存在$output_path"
    elif [ -n "$output_path" ]; then
        break
    else
    	echo "请输入生成output.zip路径"
    fi
done

echo "即将执行的命令"
echo "-----------------------"
echo "java -jar $pepk_path --keystore=$file_path --alias=$alias --output=$output_path --include-cert --rsa-aes-encryption --encryption-key-path=$encrypt_path"
echo "-----------------------"
echo "确认执行输入yes"
read confirm
if [ "$confirm" = "yes" ]; then
	echo "开始执行命令"    
else
	echo "停止执行命令"
	exit 1
fi
java -jar "$pepk_path" --keystore="$file_path" --alias="$alias" --output="$output_path" --include-cert --rsa-aes-encryption --encryption-key-path="$encrypt_path"

