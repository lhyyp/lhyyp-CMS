<template>
    <div class="home">
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
        >
            <el-form-item label="活动名称" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="封面图" prop="Image">
                <el-upload
                    name="file"
                    class="avatar-uploader"
                    accept=".jpg, .png, .jpeg, .gif"
                    :action="ruleForm.imgApi"
                    :headers="{ 'Authorization': ruleForm.Authorization }"
                    :show-file-list="false"
                    :file-list="ruleForm.fileList"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="ruleForm.Image" :src="ruleForm.Image" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>支持 png 、jpg、jpeg、gif,大小不能超过2M</span>
            </el-form-item>
            <el-form-item label="摘要" prop="abstract">
                <el-input v-model="ruleForm.abstract"></el-input>
            </el-form-item>
            <el-form-item label="正文内容" prop="content">
                <EditorBar
                    :isClear="isClear"
                    v-on:getContent="getContent"
                    v-model="ruleForm.content"
                ></EditorBar>
                <!-- <UE ref="editor" @ueditorValue="ueditorValue" :content="ruleForm.content"></UE> -->
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
// import UE from "src/components/UE.vue";
import EditorBar from "src/components/EditorBar.vue";
import { Message } from "element-ui";
import api from "src/api/api";
import { addArtByType, getArtDeatilByType } from "src/api/request.js";
export default {
    data() {
        let validcodeName = (rule, value, callback) => {
            let reg = /^[\u0391-\uFFE5A0-9]+$/;
            if (!reg.test(value)) {
                callback(new Error("名称只能是汉字或者数字组成"));
            } else {
                callback();
            }
        };
        return {
            classificationId: "", //分类id
            articleId: "", //文章ID
            isClear: false,
            ruleForm: {
                title: "",
                Image: "",
                abstract: "", //摘要
                imgApi: api.imgApi, // 图片上传地址
                content: ""
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    },
                    { validator: validcodeName, trigger: "blur" }
                ],
                Image: [
                    {
                        required: true,
                        message: "请选择封面图",
                        trigger: "change"
                    }
                ],
                abstract: [
                    {
                        required: true,
                        message: "请填写摘要",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请填写文章内容",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    components: {
        EditorBar
    },
    mounted() {
        if (this.$route.query.classificationId) {
            this.classificationId = this.$route.query.classificationId;
        } else {
            Message.error({
                message: "缺少分类Id"
            });
        }
        if (this.$route.query.articleId) {
            this.articleId = this.$route.query.articleId;
            this.getData();
        }
    },
    methods: {
        getContent(val) {
            this.ruleForm.content = val;
        },
        getData() {
            let params = {};
            params.type = this.classificationId; // 文章分类
            params.id = this.articleId;
            getArtDeatilByType({ params }).then(res => {
                if (res.status == 200) {
                    this.ruleForm.title = res.data.title;
                    this.ruleForm.Image = res.data.Image;
                    this.ruleForm.content = res.data.content;
                    this.ruleForm.abstract = res.data.abstract;
                } else {
                    Message.error({
                        message: res.msg[0]
                    });
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let formData = {};
                    formData.content = encodeURI(this.ruleForm.content); //文章内容
                    formData.title = this.ruleForm.title; //文章标题
                    if (!this.classificationId) {
                        Message.error({
                            message: "缺少分类Id"
                        });
                        return false;
                    }
                    formData.type = this.classificationId; // 文章分类
                    formData.Image = this.ruleForm.Image; //文章图片
                    formData.abstract = this.ruleForm.abstract; //文章摘要
                    if (this.articleId) {
                        formData.id = this.articleId;
                    }
                    addArtByType(formData).then(res => {
                        if (res.status == 200) {
                            this.$router.push({
                                path: "/home/" + this.classificationId
                            });
                        }
                    });
                } else {
                    Message.error({
                        message: "表单不完整"
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        ueditorValue(val) {
            this.ruleForm.content = val;
        },

        handleAvatarSuccess(res, file) {
            if (res.status == 200) {
                this.ruleForm.Image = res.data.src;
            }
        },
        beforeAvatarUpload(file) {
            const isPng = file.type === "image/png";
            const isJpg = file.type === "image/jpg";
            const isJpeg = file.type === "image/jpeg";
            const isGif = file.type === "image/gif";
            const isLt2M = file.size / (1024 * 1024) < 2;
            if (!isPng && !isJpeg && !isJpg && !isGif) {
                Message.error({
                    message: "上传头像图片只能是 png 、jpg、jpeg、gif 格式!"
                });
            }
            if (!isLt2M) {
                Message.error({ message: "上传头像图片大小不能超过2M!" });
            }
            return (isPng || isJpeg || isJpg || isGif) && isLt2M;
        }
    }
};
</script>
<style scoped lang="scss">
.home {
    width: 100%;
    background: #fff;
    padding: 30px 0;
    .demo-ruleForm {
        width: 1200px;
    }
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>


