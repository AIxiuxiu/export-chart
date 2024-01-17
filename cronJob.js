/*
 * @Description: 定时删除临时图片
 * @Author: ahl
 * @Date: 2021-01-20 11:08:38
 * @LastEditTime: 2021-01-29 10:05:46
 */
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { imgFilePath } = require('./service/config');

const fileReg = new RegExp('\\d{8}');
console.log(`-------- ${process.env.name} start -------`);

const tempFiles = [];
fs.readdirSync(imgFilePath).forEach(fileName => {
    if (fileReg.test(fileName)) {
        tempFiles.push(fileName);
    }
});

console.log('temp directory：' + tempFiles);

const endDate = dayjs().add(-3, 'day');
tempFiles.forEach(fileName => {
    var fileDate = dayjs(fileName, 'YYYYMMDD');
    if (fileDate.isBefore(endDate)) {
        console.log('remove directory：' + fileName);
        removeDir(path.join(imgFilePath, fileName));
    }
})

console.log(`-------- ${process.env.name} end -------`);

function removeDir(dir) {
    let files = fs.readdirSync(dir)
    for (var i = 0; i < files.length; i++) {
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath)
        if (stat.isDirectory()) {
            //如果是文件夹就递归下去
            removeDir(newPath);
        } else {
            //删除文件
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}