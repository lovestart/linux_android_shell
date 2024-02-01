#!/usr/bin/env bash
set -e

script_dir="$(cd "$(dirname "$0")" && pwd)"
echo "当前目录: $script_dir"



echo "输入项目代号"
while true; do
    read project_code
    # echo "你输入的是$project_code"
    if [ -n "$project_code" ]; then
        break  # 退出循环，因为路径有效
    else
        echo "请输入项目代号！项目代号: $project_code"
    fi
done


echo "输入打包脚本所在路径"
while true; do
    read -e sh_path
    # echo "你输入的是$sh_path"
    if [ -e "$sh_path" ] && [ -f "$sh_path" ]; then
        break  # 退出循环，因为路径有效
    else
        echo "请输入正确的路径！没找到打包脚本,路径: $sh_path"
    fi
done

echo "输入配置文件夹zip所在路径"
while true; do
    read -e zip_path
    # echo "你输入的是$zip_path"
    if [ -e "$zip_path" ] && [ -f "$zip_path" ]; then
        break  # 退出循环，因为路径有效
    else
        echo "请输入正确的路径！没找到配置文件夹zip,路径: $zip_path"
    fi
done

echo "输入项目源码存放路径"
while true; do
    read -e project_dir
    # echo "你输入的是$project_dir"
    if [ -n "$project_dir" ]; then
        break  # 退出循环，因为路径有效
    else
        echo "请输入正确的路径！路径: $project_dir"
    fi
done

echo "输入编译成功的aab和混淆文件导出路径"
while true; do
    read -e bundle_dir
    # echo "你输入的是$bundle_dir"
    if [ -n "$bundle_dir" ]; then
        break  # 退出循环，因为路径有效
    else
        echo "请输入正确的路径！路径: $bundle_dir"
    fi
done



if [ ! -e "$project_code" ] || [ ! -d "$project_code" ]; then
    mkdir -p "$project_code"
fi
if [ ! -e "$project_dir" ] || [ ! -d "$project_dir" ]; then
    mkdir -p "$project_dir"
fi
if [ ! -e "$bundle_dir" ] || [ ! -d "$bundle_dir" ]; then
    mkdir -p "$bundle_dir"
fi

unzip $zip_path -d $project_code
cp -f $sh_path $project_code


yes | sdkmanager --sdk_root=$ANDROID_HOME --licenses

echo '输入git源地址'
read git_remote
#echo "你输入的是$git_remote"

echo '输入分支名称，不输默认拉取主分支'
read git_brunch
#echo "你输入的是$git_brunch"

cd $project_dir

if [ -z "$git_brunch" ]; then
    git clone $git_remote
else
    git clone -b $git_brunch $git_remote
fi


echo "运行 'sh $project_code/$(basename "$sh_path")' 开始打包吧"


