# auto-eslint-cli
At present, a set of submission specifications based on prettier + husky + commitlint has been implemented, which can realize one click deployment, and there is no need for eslint deployment

## Important!!! Important!!! Important!!!
```
This tool must run in the following directory of the project
此工具必须运行在项目的根目录下
```

## Reasons for choosing auto-eslint-cli
```
1. Realize one click Automated Deployment
2. You can lock the version
3.  You can choose from a variety of presets
```

## Support Range
------------------------------------------------
```
1. Vue2 project created using Vue cli 
2. Vue3 project created using Vue cli
3. react project created using Create React App
4. ts/ js  If TS is selected, it may be just a gadget made with TS / JS
```
## options
```
1. [-y] Eslint + prittier is deployed directly by default, and secondary selection is not required 
```
## use
```
1. auto-eslint-cli init
    1. 全局安装的前提下，进行自定义选项初始化
2. auto-eslint-cli init -y
    1. 安全安装的前提下，进行一键部署
3. npx auto-eslint-cli init
    1. 通过npx的方式直接部署，不需要全局安装
```
## Recommended use (推荐使用)
```
npx auto-eslint-cli init -y/ npx auto-eslint-cli init
```
## install
------------------------------------------------
```
1. Global installation 
    1. npm install auto-eslint-cli -g
    2. yarn add auto-eslint-cli -g
notes: 
    1. The use of NPX does not require global installation
        1. 使用npx的方式进行部署 不需要全局安装
```
## use
```
// test -- Items to be set by eslint 
$ cd test

mode1:
/test $ auto-eslint-cli init

mode2:
/test $ auto-eslint-cli init -y
// This method allows quick setting and direct selection of default presets
// default presets: vue + npm

mode3: 
/test $ npx auto-eslint-cli init -y
```
## Contact me
[GitHub](https://github.com/a572251465/auto-eslint-cli)
<br/>
[More Works](http://lihh-core.top)
<br/>
[Personal Blog](http://lihh-core.top/share)