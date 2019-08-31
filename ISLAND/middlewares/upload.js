

const koaBody = require('koa-body');
const fs = require('fs');
const multer = require('koa-multer')
class Upload {
    constructor(level) {
    }
    static checkDirExist(p) {
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
    static getUploadDirName() {
        const date = new Date();
        let month = Number.parseInt(date.getMonth()) + 1;
        month = month.toString().length > 1 ? month : `0${month}`;
        const dir = `${date.getFullYear()}${month}${date.getDate()}`;
        return dir;
    }
    static getUploadFileExt(name) {
        let ext = name.split('.');
        return ext[ext.length - 1];
    }
    static getUploadFileName(ext) {
        return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`;
    }
}
const uploadFile = koaBody({
    multipart: true,  // 支持文件上传
    formidable: {
        uploadDir: `${process.cwd()}/static/upload`,
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
        onFileBegin: (name, file) => {  //name => 文件字段名
            // 获取文件后缀
            const ext = Upload.getUploadFileExt(file.name);
            // 最终要保存到的文件夹目录
            const dirName = Upload.getUploadDirName();
            const dir = `${process.cwd()}/static/upload/${dirName}`;
            // 检查文件夹是否存在如果不存在则新建文件夹
            Upload.checkDirExist(dir);
            // 获取文件名称
            const fileName = Upload.getUploadFileName(ext);
            // 重新覆盖 file.path 属性
            file.path = `${dir}/${fileName}`;
            file.outPath = `/static/upload/${dirName}/${fileName}`;
        },
    }
})

//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'static/upload/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
const upload = multer({ storage });

module.exports = {upload,uploadFile}