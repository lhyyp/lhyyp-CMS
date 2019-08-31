<template>
    <div class="basic">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header">
                        <el-button type="primary" @click="editView()">增加资讯</el-button>
                    </div>
                    <div class="table-wrapper">
                        <el-table
                            v-loading="loading"
                            element-loading-text="加载数据中"
                            :data="tableData"
                            border
                            :row-class-name="addRowClass"
                        >
                            <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                            <el-table-column label="文章标题" align="center">
                                <template slot-scope="scope">
                                    <div v-html="scope.row.title"></div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="发布时间"
                                prop="publicationTime"
                                align="center"
                                width="330"
                            ></el-table-column>
                            <el-table-column
                                label="发布时间"
                                prop="publicationTime"
                                align="center"
                                width="330"
                            >
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="viewDetail(scope.row.id)">查看</el-button>
                                    <el-button type="primary" @click="editView(scope.row.id)">编辑</el-button>
                                    <el-button type="primary" @click="delView(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            style="margin-top: 16px; text-align:right;"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[5, 10, 15, 20]"
                            :total="total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        ></el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { formatDate } from "src/utils/utils";
import score from "src/components/Score/index";
import { Message } from "element-ui";
const POSITIVE = 0;
const NEGATIVE = 1;
export default {
    mounted() {
        this.classificationId = this.$route.params.id
        this.getTableData();
    },
    watch: {
        '$route' (to, from) {
            if(to.params.id != "edit" && to.params.id != from.params.id){
                this.classificationId = to.params.id
                this.tableData = []
                this.getTableData();
            }else{
                this.$router.push({path:to.path,query:to.query})
            }
            
        }
    },
    data() {
        return {
            tableData: [],
            loading: true,
            pagesize: 10,
            currentpage: 1,
            classificationId: 1, //分类ids
            total: 0
        };
    },
    methods: {
        viewDetail(id) {},
        editView(id) {
            let obj = {};
            obj.classificationId = this.classificationId;
            if (id) {
                obj.articleId = id;
            }
            this.$router.push({
                path: "/edit",
                query: obj
            });
        },
        delView(id) {
            this.axios
                .get("/delArticle", {
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.code == 200) {
                        Message.success({
                            message: res.message
                        });
                         this.getTableData();
                    }
                });
        },
        getTableData() {
            this.axios
                .get("/getArtiList", {
                    params: {
                        number: this.pagesize,
                        page: this.currentpage,
                        classification: this.classificationId
                    }
                })
                .then(res => {
                    if (res.code === 200) {
                        res.result.map(item => {
                            item.content = decodeURI(item.content);
                        });
                        this.tableData = res.result;
                        this.total = res.count;
                    } else {
                        Message.error({
                            message: res.msg
                        });
                    }
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        handleSizeChange(value) {
            this.pagesize = value;
            this.getTableData();
        },
        handleCurrentChange(value) {
            this.currentpage = value;
            this.getTableData();
        },
        addRowClass({ row, rowIndex }) {
            if (row.rateType === NEGATIVE) {
                return "warning-row";
            }
        }
    },
    filters: {
        rateTypeToText(rateType) {
            return rateType === POSITIVE ? "满意" : "不满意";
        },
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, "yyyy-MM-dd hh:mm:ss");
        }
    },
    components: {
        score
    }
};
</script>
<style lang='scss'>
.basic {
    .el-table {
        .warning-row {
            background-color: oldlace;
        }
    }

    .recommend-tag {
        display: inline-block;
        margin: 4px 0;
        margin-right: 4px;

        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
