const Router = require("koa-router")
const fs = require("fs")
const router = new Router({
    prefix: '/api/upload'
})

const { Success ,MissingParameters} = require('../../../utils/http-exception')
const { Upload, uploadFile } = require('../../../middlewares/upload')


router.post('/', async ctx => {
    let file = ctx.request.files.file
    if(!file){
        throw new MissingParameters("选择文件")
    }
    const ext = Upload.getUploadFileExt(file.name);     // 获取文件后缀

    const fileType = ["image/png","image/jpg","image/jpeg","image/gif"]
    if (fileType.indexOf(file.type == -1)) {
        throw new MissingParameters("上传头像图片只能是 png 、jpg、jpeg、gif 格式!")
    }
    
    const dirName = ctx.request.body.dirName || Upload.getUploadDirName();          // 获取 最终要保存到的文件夹目录

    const dir = `${process.cwd()}/static/upload/${dirName}`;
    Upload.checkDirExist(dir);                        // 检查文件夹是否存在如果不存在则新建文件夹

    const fileName = Upload.getUploadFileName(ext);   // 获取文件名称
    
    const reader = fs.createReadStream(file.path)    // 创建可读流
    let filePath = `${dir}/${fileName}`               
    const upStream = fs.createWriteStream(filePath);  // 创建可写流
    reader.pipe(upStream);                             // 可读流通过管道写入可写流

    file.outPath = `/upload/${dirName}/${fileName}`;
    ctx.body = new Success({ 'src': `http://localhost:3005${ctx.request.files.file.outPath}` })
});


module.exports = router