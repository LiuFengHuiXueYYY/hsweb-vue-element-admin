

<template>

<div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="关键字" v-model="searchKey"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleUpdate()">添加菜单</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--列表-->
    <tree-table :height=650 :showIncoIndex=1 :showIndentIndex=1 :data="allMenuList" :columns="columns" border/>

    <!-- 详情弹框 -->
    <el-dialog title="" :visible.sync="roleVisible">
        <el-tabs type="border-card">
            <el-tab-pane label="菜单设置">
            </el-tab-pane>
            <el-tab-pane label="权限设置">配置管理</el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click="roleVisible = false">取消</el-button>
            <el-button type="primary" @click="updateAutzSettingData" class="title1">确定</el-button>
        </div>
    </el-dialog>
</div>

</template>

<script>

import {
    userList, userUpdate, userAdd, userById
}
from '@/api/common/user'
import {
    roleList
}
from '@/api/common/role'
import {
    getToken
}
from '@/utils/auth'
import {
    buildTree
}
from '@/utils/common/treeUtil'
import {
    urlSplice, urlMerge, urlUpdate, imgCreated, imgUrlGen, imgEmpty
}
from '@/utils/common/uploadUtil'
import {
    createQueryDSL
}
from '@/utils/common/createDSLUtil'
import {
    menuTree, menuUserTree, menuAddOrUpdate, menuDelete
}
from '@/api/common/menu'
import {
    autzsetting, updateAutzSetting
}
from '@/api/common/autzsetting'
import store from '@/store'
import '@/styles/common/custom.scss'
import treeTable from '@/components/TreeTable'
import Split from '@/components/Split'
import Transfer from '@/components/Transfer/main'
let circularJson = require('circular-json');
export default {
    data() {
            return {
                token: getToken(),
                uploadUrl: process.env.BASE_API + '/file/upload?token=' + getToken(),
                downloadBaseUrl: process.env.BASE_API + '/file/download/',
                tableList: [],
                roleTableList: [],
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
                listLoading: true,
                listRoleLoading: true,
                isShowEditVisible: false,
                roleVisible: false,
                datas: [],
                //后台数据
                temp: {
                    name: '',
                    username: '',
                    status: ''
                },
                //空字段数据
                companyData: {
                    name: '',
                    username: '',
                    status: ''
                },
                total: 0,
                page: 1,
                pageSize: 10,
                value: '',
                searchKey: '',
                listQuery: {},
                allMenuList: [],
                columns: [{
                    text: '序号',
                    value: 'indexes',
                    width: 100
                }, {
                    text: '图标',
                    value: 'icon',
                    width: 200,
                    edit: true
                }, {
                    text: '权限ID',
                    value: 'permissionId',
                    width: 200,
                    edit: true
                }, {
                    text: '菜单名称',
                    value: 'name',
                    width: 200,
                    edit: true
                }, {
                    text: 'URL',
                    value: 'url',
                    width: 200,
                    edit: true
                }, {
                    text: '排序序号',
                    value: 'sortIndex',
                    width: 150,
                    edit: true
                }, {
                    text: '描述',
                    value: 'describe',
                    width: 200,
                    edit: true
                }, {
                    text: '操作',
                    value: 'editBtn',
                    width: 200,
                    button: [{
                        icon: 'icon-tianjia',
                        excFun: function(row, that) {
                            let menu = ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%']
                            that.show_div_c.width = menu[menu.indexOf(that.show_div_c.width) + 1]
                            let menus = {}
                            menus.icon=""
                            menus.permissionId=""
                            menus.name=""
                            menus.url=""
                            menus.sortIndex=""
                            menus.describe=""
                            row._expanded = true
                            if (row.id) {
                                menus.parentId = row.id
                            }
                            if (!row.children) {
                                row.children = []
                            }
                            row.children.push(menus)
                            that.data.push() //因为数据层数过多，vue无法识别，所以往第一层加入空数据，强制刷新渲染
                        }
                    }, {
                        icon: 'icon-ziyuanbaosongtijiaoxiaohe',
                        excFun: function(row, that) {
                            menuAddOrUpdate(row).then(response => {
                                that.$notify({
                                    title: '成功',
                                    message: '新增成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                row.id = response.result
                            })
                        }
                    }, {
                        icon: 'icon-quxiao',
                        excFun: function(row, that) {
                            let f = function(list, row) {
                                list.forEach(function(val) {
                                    if (row.id == val.id) {
                                        list.splice(list.indexOf(row), 1)
                                        list.push()
                                    }
                                    if (val.children) {
                                        f(val.children, row)
                                    }
                                })
                            }
                            menuDelete(row).then(() => {
                                that.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                f(that.data, row)
                            })
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
        //此方法在于监听字段变化
        watch: {

        },
        //此方法在于需要计算的属性
        computed: {},
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
            Transfer,
            treeTable
        },
        methods: {
            //上传地址
            upload() {
                    return this.uploadUrl
                },
                changeFun(val) {
                    this.multipleSelection = val;
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
                    if (this.searchKey == '') {
                        this.listQuery = createQueryDSL().getParams()
                    } else {
                        this.listQuery = createQueryDSL().like('name', '%' + this.searchKey + '%').like('username', '%' + this.searchUserName + '%').getParams()
                    }
                    this.getList()
                },
                //搜索方法
                doFilter() {
                    this.fetchData()
                },
                getList() {
                    this.listLoading = true
                    let that = this
                    menuTree(this.listQuery).then(response => {
                        let menuList = response.result.data
                        that.allMenuList = buildTree(menuList)
                        this.listLoading = false
                    })
                },
                //新增菜单
                handleUpdate() {
                    let that = this
                    let menus = {}
                    menus.icon=""
                    menus.permissionId=""
                    menus.name=""
                    menus.url=""
                    menus.sortIndex=""
                    menus.describe=""
                    menus.parentId = '-1'
                    that.allMenuList.push(menus)
                },
                //用户赋权
                editRole(row) {
                    this.roleVisible = true
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
                    let select = this.multipleSelection
                    let that = this
                    const tempData = Object.assign({}, that.temp)
                    tempData.status = 1
                    let selectIds = []
                    select.forEach(function(val) {
                        selectIds.push(val.id)
                    })
                    tempData.roles = selectIds
                    urlUpdate(this, tempData)
                    if (!that.temp.id) {
                        userAdd(tempData).then(() => {
                            for (const v of that.tableList) {
                                if (v.userId === that.temp.userId) {
                                    const index = that.tableList.indexOf(v)
                                    that.tableList.splice(index, 1, that.temp)
                                    break
                                }
                            }
                            that.isShowEditVisible = false
                            that.$notify({
                                title: '成功',
                                message: '新增成功',
                                type: 'success',
                                duration: 2000
                            })
                        })
                    } else {
                        userUpdate(tempData).then(() => {
                            for (const v of that.tableList) {
                                if (v.userId === that.temp.userId) {
                                    const index = that.tableList.indexOf(v)
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
                updateAutzSettingData() {
                    let that = this
                    const tempData = Object.assign({}, that.temp)
                    let autzSettingData = {}
                    autzSettingData.type = 'user'
                    autzSettingData.settingFor = tempData.id
                    let menusList = []
                    that.datasLeft.forEach(function(obj) {
                        let menus = {}
                        if (obj['menu']) {
                            Object.keys(obj).forEach(function(key) {
                                if (key != 'parent' && key != 'children' && key != 'menu') {
                                    menus[key] = obj[key]
                                }
                                if (!obj['menuId']) {
                                    menus.menuId = obj.menu.id
                                }
                            })
                            menus.parentId = obj['menu'].parentId
                        } else {
                            menus.menuId = obj.id
                            menus.children = []
                            menus.parentId = obj.parentId
                        }
                        menusList.push(menus)
                    })
                    autzSettingData.menus = buildTree(menusList)
                    updateAutzSetting(autzSettingData).then(() => {

                        that.roleVisible = false
                        that.$notify({
                            title: '成功',
                            message: '更新成功',
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
                }
        }
}

</script>
