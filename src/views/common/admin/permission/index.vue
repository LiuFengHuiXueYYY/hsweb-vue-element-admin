

<template>

<div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="ID" v-model="searchName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="名称" v-model="searchName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="备注" v-model="searchName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleUpdate()">添加权限</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="tableList" v-loading="listLoading" tooltip-effect="dark" border element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column prop="" label="序号" width="65" show-overflow-tooltip>
            <template scope="scope"><span>{{scope.$index+(page - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" show-overflow-tooltip />
        <el-table-column label="状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.status | statusFilter" v-if="scope.row.status == 1">正常</el-tag>
                <el-tag size="small" :type="scope.row.status | statusFilter" v-if="scope.row.status == 0">异常</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="describe" label="备注" show-overflow-tooltip />
        <el-table-column prop="operation" label="操作 " width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-tooltip content="编辑" placement="bottom">
                    <span class="iconfont icon-bianji" @click="handleUpdate(scope)">&emsp;</span>
                </el-tooltip>
                <el-tooltip content="删除" placement="bottom">
                    <span class="iconfont icon-quxiao" @click="deletePermission(scope)">&emsp;</span>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination layout="total, prev, pager, next" background :page-size="10" @size-change="handleSizeChange" :total="total" @current-change="handleCurrentChange" style="text-align:center;">
    </el-pagination>


    <!-- 新增编辑院校 -->
    <el-dialog title="" :visible.sync="isShowEditVisible">
        <el-tabs @tab-click="handleClick" type="border-card">
            <el-tab-pane label="基本信息">
                <el-form label-position=l eft label-width="130px" :model="temp">
                    <Split title="添加权限信息"></Split>
                    <el-row :gutter="22">
                        <el-col :span="11">
                            <el-form-item label-width="180px" label="权限标识(ID)" prop="id">
                                <el-input placeholder="只能由字母数字下划线组成" v-model="temp.id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="权限名称" prop="name">
                                <el-input v-model="temp.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="22">
                        <el-col :span="22">
                            <el-form-item label-width="180px" label="支持的数据权限控制方式" prop="supportDataAccessTypes">
                                <el-select v-model="support_list" multiple collapse-tags style="width: 476px;" placeholder="请选择">
                                    <el-option v-for="item in support_options" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="22">
                        <el-col :span="22">
                            <el-form-item label-width="180px" label="备注" prop="describe">
                                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.describe">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <editTable :height=250 :showIncoIndex=1 :showIndentIndex=1 :data="allMenuList" :columns="columns" border/>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="数据视图">数据视图</el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isShowEditVisible = false">取消</el-button>
            <el-button type="primary" :loading="listLoading" @click="updateData" class="title1">确定</el-button>
        </div>
    </el-dialog>

</div>

</template>

<script>

import {
    companyList, companyUpdate, companyAdd
}
from '@/api/common/usermanager'
import {
    permissionList, permissionUpdate, permissionAdd, permissionDelete
}
from '@/api/common/permission'
import {
    getToken
}
from '@/utils/auth'
import {
    urlSplice, urlMerge, urlUpdate, imgCreated, imgUrlGen, imgEmpty
}
from '@/utils/uploadUtil'
import {
    createQueryDSL
}
from '@/utils/createDSLUtil'
import '@/styles/custom.scss'
import Split from '@/components/Split'
import editTable from '@/components/EditTable'
export default {
    data() {
            return {
                token: getToken(),
                uploadUrl: process.env.BASE_API + '/file/upload?token=' + getToken(),
                downloadBaseUrl: process.env.BASE_API + '/file/download/',
                tableList: [],
                //所有图片字段
                imgFieldList: [],
                options: [{
                    value: 0,
                    label: '启用'
                }, {
                    value: 1,
                    label: '禁用'
                }],
                type_options: [{
                    value: 1,
                    label: '企业'
                }, {
                    value: 2,
                    label: '核心企业'
                }, {
                    value: 3,
                    label: '银行'
                }],
                support_options: [{
                    value: "DENY_FIELDS",
                    label: "禁止访问字段"
                }, {
                    value: "ONLY_SELF",
                    label: "仅限本人"
                }, {
                    value: "POSITION_SCOPE",
                    label: "仅限本人及下属"
                }, {
                    value: "DEPARTMENT_SCOPE",
                    label: "所在部门"
                }, {
                    value: "ORG_SCOPE",
                    label: "所在机构"
                }, {
                    value: "CUSTOM_SCOPE_ORG_SCOPE_",
                    label: "自定义设置-机构"
                }, {
                    value: "CUSTOM_SCOPE_DEPARTMENT_SCOPE_",
                    label: "自定义设置-部门"
                }, {
                    value: "CUSTOM_SCOPE_POSITION_SCOPE_",
                    label: "自定义设置-岗位"
                }],
                current_pane: "0",
                support_list: [],
                listLoading: true,
                isShowEditVisible: false,
                deleteVisible: false,
                //后台数据
                temp: {
                    id: "",
                    name: "",
                    describe: "",
                    supportDataAccessTypes: [],
                    actions: [],
                    optionalFields: []
                },
                //空字段数据
                companyData: {
                    id: "",
                    name: "",
                    describe: "",
                    supportDataAccessTypes: [],
                    actions: [],
                    optionalFields: []
                },
                total: 0,
                page: 1,
                pageSize: 10,
                value: '',
                searchName: '',
                editStatus: true,
                listQuery: {},
                defaultMenuList: [{
                    action: 'query',
                    describe: '查询列表',
                    defaultCheck: true
                }, {
                    action: 'get',
                    describe: '查询明细',
                    defaultCheck: true
                }, {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: true
                }, {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: true
                }, {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: true
                }],
                allMenuList: [],
                columns: [{
                    text: '操作类型',
                    value: 'action',
                    width: 200,
                    edit: true
                }, {
                    text: '描述',
                    value: 'describe',
                    width: 200,
                    edit: true
                }, {
                    text: '默认选中',
                    value: 'defaultCheck',
                    width: 200,
                    component:'el-select',
                    component_config:{
                      options: [{
                          value: true,
                          label: '是'
                      }, {
                          value: false,
                          label: '否'
                      }],
                      value:true
                    }
                }, {
                    text: '操作',
                    value: 'editBtn',
                    width: 100,
                    button: [{
                        icon: 'icon-quxiao',
                        excFun: function(row, that) {
                          const index = that.data.indexOf(row)
                          that.data.splice(index, 1)
                        }
                    }],
                    head_button: [{
                        icon: 'icon-tianjia',
                        excFun: function(row, that) {
                            let menus = {}
                            menus.action = ''
                            menus.describe = ''
                            menus.defaultCheck = ''
                            that.data.push(menus)
                        }
                    }]
                }]
            }
        },
        //生命周期
        created() {
            imgCreated(this)
            this.fetchData()
        },
        //字段校验
        filters: {
            statusFilter(status) {
                const statusMap = {
                    1: 'success',
                    2: 'danger'
                }
                return statusMap[status]
            }
        },
        //组件
        components: {
            Split,
            editTable
        },
        methods: {
            //上传地址
            upload() {
                    return this.uploadUrl
                },
                //上传成功统一处理
                uploadSucess(response, file, fileList, fieldName) {
                    if (response) {
                        if (response.result) {
                            let value = response.result.id;
                            let uri = this.downloadBaseUrl
                            let obj = {};
                            obj.name = value;
                            obj.url = uri + value + "?token=" + this.token;
                            this[fieldName + 'List'].push(obj)
                        }
                    }
                },
                //删除图片成功后统一处理
                deleteSucess(file, fileList, fieldName) {
                    this[fieldName + 'List'] = fileList
                },
                //列表加载
                fetchData() {
                    if (this.searchName == '') {
                        this.listQuery = createQueryDSL().limit(this.page - 1, 10).like('name', this.searchName).getParams()
                    } else {
                        this.listQuery = createQueryDSL().limit(this.page - 1, 10).and('type', 1, 'eq').like('name', '%' + this.searchName + '%').getParams()
                    }
                    this.getList()
                },
                //搜索方法
                doFilter() {
                    this.fetchData()
                },
                getList() {
                    this.listLoading = true
                    permissionList(this.listQuery).then(response => {
                        const limit = 10
                        const pageList = response.result.data
                        this.total = response.result.total
                        this.tableList = pageList
                        this.listLoading = false
                    })
                },
                //编辑按钮
                handleUpdate(scope) {
                    let row
                    if (scope) row = this.tableList[scope.$index]
                    this.isShowEditVisible = true
                    this.imgShow(row)
                    if (row) {
                        this.editStatus = false
                        this.allMenuList = row.actions
                        if (row.supportDataAccessTypes) {
                            this.support_list = row.supportDataAccessTypes
                        } else {
                            this.support_list = []
                        }
                    } else {
                        this.allMenuList = Object.assign([], this.defaultMenuList)
                        this.support_list = []
                        this.editStatus = true
                    }
                },
                //显示单条详情
                showDetail(row) {
                    this.deleteVisible = true
                    this.imgShow(row)
                },
                //图片显示
                imgShow(row) {
                    if (row) {
                        imgUrlGen(this, row)
                        this.temp = Object.assign({}, row)
                    } else {
                        imgEmpty(this)
                        this.temp = this.companyData
                    }
                },
                //修改和新增
                updateData() {
                    let that = this
                        // if (this.current_pane == "0") {
                        //     that.updateData0(that)
                        // } else {
                        //     that.updateData1(that)
                        // }
                    const tempData = Object.assign({}, that.temp)
                    urlUpdate(that, tempData)
                    tempData.actions = that.allMenuList
                    tempData.supportDataAccessTypes = that.support_list
                    if (that.editStatus) {
                        permissionAdd(tempData).then(() => {
                            that.tableList.push(that.temp)
                            that.isShowEditVisible = false
                            that.temp.actions = tempData.actions
                            that.temp.supportDataAccessTypes = tempData.supportDataAccessTypes
                            that.allMenuList = tempData.actions
                            that.temp.status = 1
                            that.support_list = tempData.supportDataAccessTypes
                            that.$notify({
                                title: '成功',
                                message: '新增成功',
                                type: 'success',
                                duration: 2000
                            })
                        })
                    } else {
                        permissionUpdate(tempData).then(() => {
                            for (const v of that.tableList) {
                                if (v.id === that.temp.id) {
                                    const index = that.tableList.indexOf(v)
                                    that.temp.supportDataAccessTypes = that.support_list
                                    that.tableList.splice(index, 1, that.temp)
                                    break
                                }
                            }
                            that.isShowEditVisible = false
                            that.$notify({
                                title: '成功',
                                message: '更新成功',
                                type: 'success',
                                duration: 2000
                            })
                        })
                    }
                },
                deletePermission(val, scope) {
                    let that = this
                    if (scope) val = this.tableList[scope.$index]
                    permissionDelete(val).then(() => {
                        const index = this.tableList.indexOf(val)
                        this.tableList.splice(index, 1)
                        that.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                    })
                },
                handleSizeChange(val) {
                    this.page = val
                    this.fetchData()
                },
                handleCurrentChange(val) {
                    this.page = val
                    this.fetchData()
                },
                handleClick(e) {
                    this.current_pane = e.paneName
                }
        }
}

</script>
