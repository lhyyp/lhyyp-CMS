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
                                prop="createdAt"
                                align="center"
                                width="330"
                            >
                            <template slot-scope="scope">{{scope.row.createdAt|formatDate }}</template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                prop=""
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
import { Message } from "element-ui";
import { formatDate } from "src/utils/utils";
import { getListByType ,deleteArtByType} from "src/api/request.js";
export default {
    mounted() {
        this.classificationId = this.$route.params.id;
        this.getTableData();
    },
    watch: {
        $route(to, from) {
            if (to.params.id != "edit" && to.params.id != from.params.id) {
                this.classificationId = to.params.id;
                this.tableData = [];
                this.getTableData();
            } else {
                this.$router.push({ path: to.path, query: to.query });
            }
        }
    },
     filters: {
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, "yyyy-MM-dd hh:mm:ss");
        }
    },
    data() {
        return {
            tableData: [],
            loading: true,
            pageSize: 1,
            pageNum: 10,
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
            let params = {};
            params.type = this.classificationId;
            params.art_id = id;
            deleteArtByType(params).then((res) => {
                if(res.status == 200){
                    Message.success({
                        message: res.msg
                    });
                    this.getTableData()
                }else{
                    Message.error({
                        message: res.msg[0]
                    });
                }
            })
        },
        getTableData() {
            let params = {};
            params.type = this.classificationId;
            params.pageSize = this.pageSize;
            params.pageNum = this.pageNum;
            getListByType({ params }).then(res => {
                if (res.status == 200) {
                    this.total = res.data.count;
                    this.tableData = res.data.rows;
                    this.loading = false;
                } else {
                    Message.error({
                        message: res.msg[0]
                    });
                }
            });
        },
        handleCurrentChange(value) {
            this.pageSize = value;
            this.getTableData();
        },
        handleSizeChange(value) {
            this.pageNum = value;
            this.getTableData();
        },
        addRowClass({ row, rowIndex }) {
            if (row.rateType === 1) {
                return "warning-row";
            }
        }
    },
    components: {}
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
