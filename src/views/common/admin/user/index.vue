

<template>

<div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="姓名" v-model="searchName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="用户名" v-model="searchUserName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleUpdate()">添加用户</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="tableList" v-loading="listLoading" tooltip-effect="dark" border element-loading-text="拼命加载中" style="width: 100%;">
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
                <el-tooltip content="编辑" placement="bottom">
                    <span class="iconfont icon-bianji" @click="handleUpdate(scope)">&emsp;</span>
                </el-tooltip>
                <el-tooltip content="用户赋权" placement="bottom">
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
            <el-button type="primary" :loading="listLoading" @click="updateData('rules_form')" class="title1">确定</el-button>
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
                        <el-tree :default-checked-keys="defaultChecks" :data="details" show-checkbox node-key="id" :props="defaultProps">
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
                current_pane: "0",
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
                permissionMap: [],
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
                defaultChecks: []
            }
        },
        //生命周期
        created() {
            imgCreated(this)
            this.allMenuInit()
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
                            if(response.result.details && response.result.details.length > 0){
                              permissionAll().then(res => {
                                  let permissionList = res.result.data
                                  permissionList.forEach(function(val) {
                                      that.permissionMap[val.id] = val
                                  })
                                  that.details = that.initPermissionData(response.result.details)
                              })
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
                getSelectMenuPermission() {
                    let that = this
                    let permissions = []
                    that.datasLeft.forEach(function(val) {
                        let permission
                        let menuPer = val.menu.permissionId
                        if (menuPer && menuPer != "") {
                            menuPer = menuPer.split(",")
                        } else {
                            menuPer = []
                        }
                        if (val.menu) {
                            menuPer.forEach(function(val) {
                                if (permission = that.permissionMap[val])
                                    permissions.push(permission)
                            });
                        }
                    })
                    return permissions
                },
                //tab点击切换
                handleClick(e) {
                    let that = this
                    that.current_pane = e.paneName
                    if (e.paneName == 1) {
                        if (that.permissionMap || that.permissionMap.length <= 0) {
                            permissionAll().then(response => {
                                let permissionList = response.result.data
                                permissionList.forEach(function(val) {
                                    that.permissionMap[val.id] = val
                                })
                                that.getPermissions()
                            })
                        } else {
                            that.getPermissions()
                        }
                    }
                },
                getPermissions() {
                    this.initPermissionTabActive()
                },
                initPermissionTabActive() {
                    let that = this
                    if(that.details && that.details.length > 0){
                      that.details.push()
                      return that.details
                    }
                    that.defaultChecks = []
                    let menuPermissions = that.getSelectMenuPermission();
                    let list = [];
                    let tmp = [];
                    let old = [];
                    let dataMap = {};
                    old.forEach(function(val) {
                        dataMap[val.permissionId] = val;
                        let dataAccessesMap = val.dataAccessesMap = {};
                        $(val.dataAccesses).each(function() {
                            dataAccessesMap[val.action + val.type] = val;
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
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    }

                    menuPermissions.forEach(function(val) {
                        if (tmp.indexOf(val.id) !== -1) return;
                        let actions = [];
                        let permission = val;
                        let optionalFields = val.optionalFields;
                        let oldPer = dataMap[permission.id];

                        val.actions.forEach(function(v) {
                            let action = v;
                            let fields = [];
                            let dataAccesses = [];
                            if (oldPer && oldPer.dataAccesses) {
                                oldPer.dataAccesses.forEach(function(ov) {
                                    if (ov.type == "DENY_FIELDS") return;
                                    if (ov.action == action.action)
                                        dataAccesses.push(ov);
                                });
                            }
                            optionalFields.forEach(function(ofv) {
                                let fieldChecked = isChecked(permission.id, action.action, ofv.name);
                                let ofvId = val.id + "-" + v.action + "-" + ofv.name
                                fields.push({
                                    id: ofvId,
                                    type: "fields",
                                    checked: fieldChecked,
                                    field: ofv.name,
                                    label: ofv.describe ? ofv.describe : ofv.name
                                });
                                that.defaultChecks.push(ofvId)
                            });
                            let vId = val.id + "-" + v.action
                            let actionData = {
                                id: vId,
                                type: "action",
                                action: v.action,
                                label: v.describe ? v.describe : v.action,
                                children: Object.assign([], fields),
                                dataAccesses: dataAccesses,
                                defaultCheck: v.defaultCheck
                            };
                            if (v.defaultCheck) {
                                that.defaultChecks.push(vId)
                            }
                            if (fields.length == 0 && oldPer && oldPer.actions.indexOf(v.action) != -1) {
                                actionData.checked = true;
                            }
                            actions.push(actionData);
                        });
                        list.push({
                            id: val.id,
                            permission: val,
                            permissionId: val.id,
                            label: val.name,
                            children: actions,
                            defaultCheck: val.defaultCheck
                        });
                        if (val.defaultCheck) {
                            that.defaultChecks.push(val.id)
                        }
                        tmp.push(val.id);
                    });
                    that.details = list
                },
                getPermissionData(merge, priority) {
                    let that = this
                    let list = [];
                    that.details.forEach(function(val) {
                        let actions = [];
                        let dataAccesses = {};
                        val.children.forEach(function(cval) {
                            let action = cval;
                            if (action.dataAccesses) {
                                action.dataAccesses.forEach(function(aval) {
                                    dataAccesses[aval.action + aval.type] = aval;
                                });
                            }
                            if (action.children) {
                                let denyField = [];
                                action.children.forEach(function(aval) {
                                    if (!aval.checked)
                                        denyField.push(aval.field);
                                });
                                if (denyField.length === action.children.length && !action.checked) {
                                    return;
                                }
                                //没有全部进行勾选,则进行deny操作
                                if (denyField.length > 0) {
                                    let fieldDataAccess = {
                                        action: action.action,
                                        type: "DENY_FIELDS",
                                        describe: "不能操作字段",
                                        config: mini.encode({
                                            fields: denyField
                                        })
                                    };
                                    dataAccesses[fieldDataAccess.action + fieldDataAccess.type] = fieldDataAccess;
                                }
                            }
                            actions.push(action.action);
                        });
                        //设置
                        if (val.dataAccesses) {
                            val.dataAccesses.forEach(function(dval) {
                                let dataAccess = dval;
                                actions.forEach(function(aval) {
                                    if (!dataAccesses[aval.action + dataAccess.type]) {
                                        dataAccesses[aval.action + dataAccess.type] = dataAccess;
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
                            permissionId: val.permissionId,
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
                    if (details) {
                        var list = [];
                        details.forEach(function(val) {
                            var permission = that.permissionMap[val.permissionId];
                            var optionalFields = permission.optionalFields;
                            var actions = [];
                            var detail = Object.assign({}, val);

                            permission.actionMap = {};
                            permission.actions.forEach(function(v) {
                                permission.actionMap[v.action] = v;
                            });
                            detail.dataAccessesMap = {};
                            detail.dataAccesses.forEach(function(v) {
                                detail.dataAccessesMap[v.action + v.type] = v;
                            });

                            function isChecked(action, field) {
                                if (detail.actions.indexOf(action) == -1) return false;
                                if (field) {
                                    var dataAccess = detail.dataAccessesMap[action + "DENY_FIELDS"];
                                    if (dataAccess) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                                return true;
                            }

                            permission.actions.forEach(function(v) {
                                var action = v;
                                var fields = [];
                                var dataAccesses = [];
                                if (detail.dataAccesses) {
                                    detail.dataAccesses.forEach(function(dv) {
                                        if (dv.type == "DENY_FIELDS") return;
                                        if (dv.action == action.action)
                                            dataAccesses.push(dv);
                                    });
                                }
                                optionalFields.forEach(function(ov) {
                                    var fieldChecked = isChecked(action.action, ov.name);
                                    fields.push({
                                        type: "fields",
                                        checked: fieldChecked,
                                        field: ov.name,
                                        label: ov.describe ? ov.describe : ov.name
                                    });
                                });
                                var actionData = {
                                    type: "action",
                                    action: v.action,
                                    label: v.describe ? v.describe : v.action,
                                    children: Object.assign([], fields),
                                    dataAccesses: dataAccesses
                                };
                                if (fields.length == 0 && detail.actions.indexOf(v.action) != -1) {
                                    actionData.checked = true;
                                }
                                actions.push(actionData);
                            });
                            list.push({
                                permission: val,
                                permissionId: permission.id,
                                label: val.name,
                                children: actions
                            });
                        });
                        return list;
                    }
                }
        }
}

</script>
