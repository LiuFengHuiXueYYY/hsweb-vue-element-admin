

<template>

<div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
            <el-form-item v-has="'user-query'">
                <el-input placeholder="姓名" v-model="searchName"></el-input>
            </el-form-item>
            <el-form-item v-has="'user-query'">
                <el-input placeholder="用户名" v-model="searchUserName"></el-input>
            </el-form-item>
            <el-form-item v-has="'user-query'">
                <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-has="'user-add'" type="primary" @click="handleUpdate()">添加用户</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--列表-->
    <el-table v-has="'user-get'" :data="tableList" v-loading="listLoading" tooltip-effect="dark" border element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column prop="" label="序号" width="65" show-overflow-tooltip>
            <template scope="scope"><span>{{scope.$index+(page - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip />
        <el-table-column prop="username" min-width="150px" label="用户名" show-overflow-tooltip />
        <el-table-column label="是否启用" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 1">启用</el-tag>
                <el-tag size="small" :type="scope.row.status | statusFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.status == 0">禁用</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作 " width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-tooltip v-has="'user-update'" content="编辑" placement="bottom">
                    <span class="iconfont icon-bianji" @click="handleUpdate(scope)">&emsp;</span>
                </el-tooltip>
                <el-tooltip v-has="'autz-setting-update'" content="用户赋权" placement="bottom">
                    <span class="iconfont icon-jiaoseshouquan" @click="editRole(scope.row)">&emsp;</span>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination layout="total, prev, pager, next" background :page-size="10" @size-change="handleSizeChange" :total="total" @current-change="handleCurrentChange" style="text-align:center;">
    </el-pagination>


    <!-- 新增编辑院校 -->
    <el-dialog title="" :visible.sync="isShowEditVisible">
        <el-form label-width="100px" ref="rules_form" :rules="rules" :model="temp">
            <Split title="添加用户"></Split>
            <el-row :gutter="22">
                <el-col :span="22">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="temp.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="11">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="temp.username"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="temp.password"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="22">
                    <el-form-item label="备注" prop="describe">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.describe">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <Split title="设置角色"></Split>
            <el-table ref="multipleTable" @selection-change="changeFun" tooltip-effect="dark" style="width: 100%" :data="roleTableList">
                <el-table-column type="selection" width="155">
                </el-table-column>
                <el-table-column prop="" label="序号" width="250">
                    <template scope="scope"><span>{{scope.$index + 1}} </span></template>
                </el-table-column>
                <el-table-column prop="name" label="角色名" width="270" show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isShowEditVisible = false">取消</el-button>
            <el-button v-has="'user-add'" type="primary" :loading="listLoading" @click="updateData('rules_form')" class="title1">确定</el-button>
        </div>
    </el-dialog>

    <!-- 详情弹框 -->
    <el-dialog title="" :visible.sync="roleVisible">
        <el-tabs @tab-click="handleClick" type="border-card">
            <el-tab-pane label="菜单设置">
                <Transfer :columnsLeft="columnsLeft" :columnsRight="columnsRight" :datasLeftTmp="datasLeft" :datasRightTmp="datasRight" :showIncoIndex=1 :showIndentIndex=1>
                </Transfer>
            </el-tab-pane>
            <el-tab-pane label="权限设置">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <Split style="margin-bottom:10px;" title="搜索"></Split>
                        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                        </el-input>
                        <div style="height:10px;width:100%;"></div>
                        <Split style="margin-bottom:10px;" title="权限信息"></Split>
                        <el-tree ref="tree" :default-checked-keys="defaultChecks" :data="newDetails" show-checkbox node-key="id" :props="defaultProps">
                        </el-tree>
                    </el-col>
                    <el-col :span="4">
                    </el-col>
                    <el-col :span="12">
                        <Split style="margin-bottom:10px;" title="数据权限设置"></Split>
                        <el-button>应用到所有操作</el-button>
                    </el-col>
                </el-row>
                <div>
                </div>
                <div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click="roleVisible = false">取消</el-button>
            <!-- 要传入ref的值 -->
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
import store from '@/store'
import {
    getToken
}
from '@/utils/auth'
import {
    urlSplice, urlMerge, urlUpdate, imgCreated, imgUrlGen, imgEmpty
}
from '@/utils/common/uploadUtil'
import {
    createQueryDSL
}
from '@/utils/common/createDSLUtil'
import Split from '@/components/Split'
import Transfer from '@/components/Transfer/main'
import {
    menuTree, menuUserTree, menuAddOrUpdate
}
from '@/api/common/menu'
import {
    autzsetting, updateAutzSetting
}
from '@/api/common/autzsetting'
import '@/styles/common/custom.scss'
import {
    buildTree
}
from '@/utils/common/treeUtil'
import {
    patterns
}
from '@/utils/common/patterns' //正则统一管理
import {
    permissionAll
}
from '@/api/common/permission'
let circularJson = require('circular-json');
export default {
    data() {
            return {
                token: getToken(),
                uploadUrl: process.env.BASE_API + '/file/upload?token=' + getToken(),
                downloadBaseUrl: process.env.BASE_API + '/file/download/',
                rules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }]
                },
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
                defMenu: 'm1',
                listLoading: true,
                listRoleLoading: true,
                isShowEditVisible: false,
                roleVisible: false,
                datasLeft: [],
                datasRight: [],
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
                searchName: '',
                searchUserName: '',
                listQuery: {},
                listRoleQuery: {},
                allMenuMap: {},
                allMenuList: [],
                permissionMap: {},
                columnsLeft: [{
                    text: '序号',
                    value: 'indexes',
                    width: 15
                }, {
                    text: '图标',
                    value: 'icon',
                    width: 25
                }, {
                    text: '菜单名称',
                    value: 'name',
                    width: 35
                }, {
                    text: '操作',
                    value: 'editBtn',
                    width: 25,
                    button: [{
                        icon: 'icon-quxiao'
                    }]
                }],
                columnsRight: [{
                    text: '操作',
                    value: 'editBtn',
                    width: 15,
                    button: [{
                        icon: 'icon-quxiao'
                    }]
                }, {
                    text: '图标',
                    value: 'icon',
                    width: 25
                }, {
                    text: '菜单名称',
                    value: 'name',
                    width: 35
                }, {
                    text: '描述',
                    value: 'describe',
                    width: 25
                }],
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                details: [],
                defaultChecks: [],
                oldDetails: [],
                newDetails: [],
                current_pane: 0
            }
        },
        //生命周期
        created() {
            let that = this
            imgCreated(this)
            this.allMenuInit()
            this.fetchData()
        },
        //此方法在于监听字段变化
        watch: {
            datasLeft() {
                let that = this
                if (!JSON.stringify(that.permissionMap) == "{}") {
                    permissionAll().then(res => {
                        let permissionList = res.result.data
                        permissionList.forEach(function(val) {
                            that.permissionMap[val.id] = val
                        })
                        that.oldDetails = that.initPermissionData([])
                        that.newDetails = that.oldDetails
                        that.initPermissionTabActive();
                        that.saveDataAccess();
                    })
                } else {
                    that.oldDetails = that.initPermissionData([])
                    that.newDetails = that.oldDetails
                    that.initPermissionTabActive();
                    that.saveDataAccess();
                }
            }
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
            Transfer
        },
        methods: {
            //上传地址
            upload() {
                    return this.uploadUrl
                },
                changeFun(val) {
                    this.multipleSelection = val;
                },
                allMenuInit() {
                    let that = this
                    menuTree().then(response => {
                        let menuList = response.result.data
                        that.allMenuList = menuList
                        for (const m of menuList) {
                            that.allMenuMap[m.id] = m
                        }
                    })
                },
                datasLeftInit(uid) {
                    let that = this
                    autzsetting('', 'user', uid).then(response => {
                        if (response.result) {
                            let menus = response.result.menus
                            if (JSON.stringify(that.permissionMap) == "{}") {
                                permissionAll().then(res => {
                                    let permissionList = res.result.data
                                    permissionList.forEach(function(val) {
                                        that.permissionMap[val.id] = val
                                    })
                                    that.oldDetails = that.initPermissionData(response.result.details)
                                    that.newDetails = that.oldDetails
                                })
                            } else {
                                that.oldDetails = that.initPermissionData(response.result.details)
                                that.newDetails = that.oldDetails
                            }
                            for (let l of menus) {
                                let item = that.allMenuMap[l.menuId]
                                l.menu = item
                                if (item) {
                                    l.icon = item.icon
                                    l.name = item.name
                                }
                            }
                            that.datasLeft = menus
                        } else {
                            that.datasLeft = []
                        }
                        that.datasRightInit()
                    })
                },
                datasRightInit() {
                    let that = this
                    let allMenuMap = that.allMenuMap
                    let datasLeft = that.datasLeft
                    let mapping = {}
                    for (const d of datasLeft) {
                        mapping[d.menuId] = d
                    }
                    let list = [];
                    for (const a of that.allMenuList) {
                        if (!mapping[a.id]) {
                            list.push(a);
                        }
                    }
                    that.datasRight = list
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
                    if (this.searchName == '' && this.searchUserName == '') {
                        this.listQuery = createQueryDSL().limit(this.page - 1, 10).getParams()
                    } else {
                        this.listQuery = createQueryDSL().limit(this.page - 1, 10).like('name', '%' + this.searchName + '%').and().like('username', '%' + this.searchUserName + '%').getParams()
                    }
                    this.getList()
                },
                //搜索方法
                doFilter() {
                    this.fetchData()
                },
                getList() {
                    this.listLoading = true
                    userList(this.listQuery).then(response => {
                        const pageList = response.result.data
                        this.total = response.result.total
                        this.tableList = pageList
                        this.listLoading = false
                    })
                },
                getRoleList() {
                    this.listRoleLoading = true
                    this.listRoleQuery = createQueryDSL().and('paging', false).getParams()
                    roleList(this.listRoleQuery).then(response => {
                        const pageRoleList = response.result.data
                        this.roleTableList = pageRoleList
                        this.listRoleLoading = false
                    })
                },
                //编辑按钮
                handleUpdate(scope) {
                    let row
                    if (scope) row = this.tableList[scope.$index]
                    this.isShowEditVisible = true
                    let that = this
                    if (row) {
                        userById(row).then(response => {
                            let res = response.result
                            if (res) {
                                let roles = res.roles
                                let allRoles = that.$refs.multipleTable.data
                                let allRolesMap = {}
                                allRoles.forEach(function(val) {
                                    allRolesMap[val.id] = val
                                })
                                if (roles && roles.length > 0) {
                                    roles.forEach(function(val) {
                                        if (allRolesMap[val]) {
                                            that.$refs.multipleTable.toggleRowSelection(allRolesMap[val])
                                        }
                                    })
                                }
                            }
                        })
                    }
                    this.getRoleList()
                    this.imgShow(row)
                },
                //用户赋权
                editRole(row) {
                    this.details = []
                    this.roleVisible = true
                    this.datasLeftInit(row.id)
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
                updateData(rules_form) {
                    this.$refs[rules_form].validate((valid) => {
                        if (valid) {
                            let select = this.multipleSelection
                            let that = this
                            that.temp.status = 1
                            const tempData = Object.assign({}, that.temp)
                            tempData.status = 1
                            let selectIds = []
                            if (select) {
                                select.forEach(function(val) {
                                    selectIds.push(val.id)
                                })
                            }
                            tempData.roles = selectIds
                            urlUpdate(this, tempData)
                            if (!that.temp.id) {
                                userAdd(tempData).then(() => {
                                    that.tableList.push(that.temp)
                                    that.total += 1
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
                                        if (v.id === that.temp.id) {
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
                        } else {
                            return false
                        }
                    })
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
                            menus.parentId = obj.parentId
                            menus.id = obj.id
                        } else {
                            menus.menuId = obj.id
                            menus.children = []
                            menus.parentId = obj.parentId
                        }
                        menusList.push(menus)
                    })
                    autzSettingData.menus = buildTree(menusList)
                    autzSettingData.details = that.getPermissionData(true, 10)
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
                },
                //tab点击切换
                handleClick(e) {
                    let that = this
                    that.current_pane = e.paneName
                    if (e.paneName == 1) {
                        that.initPermissionTabActive();
                        that.saveDataAccess();
                    }
                },
                initPermissionTabActive() {
                    let that = this
                    that.defaultChecks = []
                    let menuPermissions = that.getSelectMenuPermission();
                    let list = [];
                    let tmp = []
                    let old = that.getPermissionData();
                    let dataMap = {};
                    old.forEach(function(v) {
                        dataMap[v.permissionId] = v;
                        let dataAccessesMap = v.dataAccessesMap = {};
                        v.dataAccesses.forEach(function(v1) {
                            dataAccessesMap[v1.action + v1.type] = v1;
                        });
                    });

                    function isChecked(permission, action, field) {
                        if (old.length === 0) return true;
                        let oldPer = dataMap[permission];
                        if (!oldPer) return true;
                        if (field) {
                            if (!(oldPer.actions.indexOf(action) > -1)) return false;
                            let dataAccess = oldPer.dataAccessesMap[action + "DENY_FIELDS"];
                            if (dataAccess) {
                                return !(JSON.parse(dataAccess.config).fields.indexOf(field) > -1);
                            } else {
                                return true;
                            }
                        }
                        return false;
                    }

                    menuPermissions.forEach(function(v) {
                        if (tmp.indexOf(v.id) !== -1) return;
                        let actions = [];
                        let permission = v;
                        let optionalFields = v.optionalFields;
                        let oldPer = dataMap[permission.id];

                        v.actions.forEach(function(v1) {
                            let action = v1;
                            let fields = [];
                            let dataAccesses = [];
                            if (oldPer && oldPer.dataAccesses) {
                                oldPer.dataAccesses.forEach(function(v2) {
                                    if (v2.type == "DENY_FIELDS") return;
                                    if (v2.action == action.action)
                                        dataAccesses.push(v2);
                                });
                            }
                            optionalFields.forEach(function(v2) {
                                let fieldChecked = isChecked(permission.id, action.action, v2.name);
                                that.defaultChecks.push(that.generatorId(v, v1, v2))
                                fields.push({
                                    id: that.generatorId(v, v1, v2),
                                    type: "fields",
                                    checked: fieldChecked,
                                    field: v2.name,
                                    label: v2.describe ? v2.describe : v2.name
                                });
                            });
                            let actionData = {
                                id: that.generatorId(v, v1),
                                type: "action",
                                action: v1.action,
                                label: v1.describe ? v1.describe : v1.action,
                                children: Object.assign([], fields),
                                dataAccesses: dataAccesses
                            };
                            if (fields.length == 0 && oldPer && oldPer.actions.indexOf(v1.action) != -1) {
                                actionData.checked = true;
                            }
                            if (actionData.checked) {
                                that.defaultChecks.push(that.generatorId(v, v1))
                            }
                            if (!oldPer && v1.defaultCheck) {
                                that.defaultChecks.push(that.generatorId(v, v1))
                            }
                            actions.push(actionData);
                        });
                        list.push({
                            id: that.generatorId(v),
                            permission: v,
                            permissionId: v.id,
                            label: v.name,
                            children: actions
                        });
                        tmp.push(v.id);
                    });
                    that.newDetails = list
                },
                getSelectMenuPermission() {
                    let that = this
                    let permissions = [];
                    that.datasLeft.forEach(function(v) {
                        let permission, menuPer
                        if (v.menu) {
                            menuPer = v.menu.permissionId
                        } else {
                            menuPer = v.permissionId
                        }

                        if (menuPer && menuPer.length > 0) {
                            menuPer = menuPer.split(",")
                        } else {
                            menuPer = []
                        }
                        menuPer.forEach(function(v1) {
                            if (permission = that.permissionMap[v1])
                                permissions.push(permission);
                        });
                    });
                    return Object.assign([], permissions)
                },
                getPermissionData(merge, priority) {
                    let that = this
                    let list = [];
                    console.log(that.$refs.tree.getCheckedKeys().includes("file-static"))
                    that.$refs.tree.data.forEach(function(v) {
                        let actions = [];
                        let dataAccesses = {};
                        v.children.forEach(function(v1) {
                            let action = v1;
                            if (action.dataAccesses) {
                                action.dataAccesses.forEach(function(v2) {
                                    dataAccesses[v2.action + v2.type] = v2;
                                });
                            }
                            if (action.children) {
                                let denyField = [];
                                action.children.forEach(function(v2) {
                                    if (!v2.checked)
                                        denyField.push(v2.field);
                                });
                                if (denyField.length === action.children.length && !that.$refs.tree.getCheckedKeys().includes(that.generatorId(v, action))) {
                                    return;
                                }
                                //没有全部进行勾选,则进行deny操作
                                if (denyField.length > 0) {
                                    let fieldDataAccess = {
                                        action: action.action,
                                        type: "DENY_FIELDS",
                                        describe: "不能操作字段",
                                        config: JSON.stringify({
                                            fields: denyField
                                        })
                                    };
                                    dataAccesses[fieldDataAccess.action + fieldDataAccess.type] = fieldDataAccess;
                                }
                            }
                            actions.push(action.action);
                        });
                        //设置
                        if (v.dataAccesses) {
                            v.dataAccesses.forEach(function(v1) {
                                let dataAccess = v1;
                                actions.forEach(function(v2) {
                                    if (!dataAccesses[v2.action + dataAccess.type]) {
                                        dataAccesses[v2.action + dataAccess.type] = dataAccess;
                                    }
                                })
                            })
                        }
                        let tmp = [];
                        for (let action in dataAccesses) {
                            tmp.push(dataAccesses[action]);
                        }
                        //create data access
                        list.push({
                            id: that.generatorId(v),
                            permissionId: v.permissionId,
                            actions: actions,
                            dataAccesses: tmp,
                            merge: merge,
                            priority: priority ? priority : 0
                        });
                    });
                    return list;
                },
                initPermissionData(details) {
                    let that = this
                    that.defaultChecks = []
                    if (details) {
                        let list = [];
                        details.forEach(function(v) {
                            let permission = that.permissionMap[v.permissionId];
                            let optionalFields = permission.optionalFields;
                            let actions = [];
                            let detail = Object.assign({}, v)

                            permission.actionMap = {};
                            permission.actions.forEach(function(v1) {
                                permission.actionMap[v1.action] = v1;
                            });
                            detail.dataAccessesMap = {};
                            if (detail.dataAccesses) {
                                detail.dataAccesses.forEach(function(v1) {
                                    detail.dataAccessesMap[v1.action + v1.type] = v1;
                                });
                            }

                            function isChecked(action, field) {
                                if (detail.actions && detail.actions.indexOf(action) == -1) return false;
                                if (field) {
                                    let dataAccess = detail.dataAccessesMap[action + "DENY_FIELDS"];
                                    if (dataAccess) {
                                        return !(JSON.parse(dataAccess.config).fields.indexOf(field) > -1);
                                    } else {
                                        return true;
                                    }
                                }
                                return true;
                            }

                            permission.actions.forEach(function(v1) {
                                let action = v1;
                                let fields = [];
                                let dataAccesses = [];
                                if (detail.dataAccesses) {
                                    detail.dataAccesses.forEach(function(v2) {
                                        if (v2.type == "DENY_FIELDS") return;
                                        if (v2.action == action.action)
                                            dataAccesses.push(v2);
                                    });
                                }
                                optionalFields.forEach(function(v2) {
                                    let fieldChecked = isChecked(action.action, v2.name);
                                    if (fieldChecked) {
                                        that.defaultChecks.push(that.generatorId(v, v1, v2))
                                    }
                                    fields.push({
                                        id: that.generatorId(v, v1, v2),
                                        type: "fields",
                                        checked: fieldChecked,
                                        field: v2.name,
                                        label: v2.describe ? v2.describe : v2.name
                                    });
                                });
                                let actionData = {
                                    id: that.generatorId(v, v1),
                                    type: "action",
                                    action: v1.action,
                                    label: v1.describe ? v1.describe : v1.action,
                                    children: Object.assign([], fields),
                                    dataAccesses: dataAccesses
                                };
                                if (fields.length == 0 && detail.actions && detail.actions.indexOf(v1.action) != -1) {
                                    actionData.checked = true;
                                }
                                if (actionData.checked) {
                                    that.defaultChecks.push(that.generatorId(v, v1))
                                }
                                actions.push(actionData);
                            });
                            list.push({
                                id: that.generatorId(v),
                                permission: permission,
                                permissionId: permission.id,
                                label: permission.name,
                                children: actions
                            });
                        });
                        return list
                    }
                },
                saveDataAccess() {

                },
                generatorId(v, v1, v2) {
                    return (!v ? "" : (!v.id ? "" : v.id)) + (!v1 ? "" : (!v1.action ? "" : "-")) + (!v1 ? "" : (!v1.action ? "" : v1.action)) + (!v2 ? "" : (!v2.name ? "" : "-")) + (!v2 ? "" : (!v2.name ? "" : v2.name))
                }
        }
}

</script>
