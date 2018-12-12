<template>
  <el-table :data="formatData" :height="height" :row-style="showRow" v-bind="$attrs">
    <el-table-column show-overflow-tooltip v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index,scope.row)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column :render-header="(h,c)=>{return renderHeader(h,c,column)}" class="table_box" show-overflow-tooltip v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">

        <div v-if="column.value == 'indexes'"><span>{{ scope.$index + 1}}</span></div>
        <div v-if="column.value == 'editBtn'" >
          <span :class="'iconfont' + ' ' + btn.icon" v-for="(btn, index) in column.button" @click="excFun(btn.excFun, scope.row)" >&emsp;</span>
        </div>
        <div v-if="column.component == 'el-select'">
          <template>
            <el-select v-model="scope.row[column.value]" placeholder="请选择">
              <el-option
                v-for="item in column.component_config.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
        <div v-else>
          <span v-for="space in scope.row._level" v-if="index === showIndentIndex" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index,scope.row)">
            <i v-if="!scope.row._expanded" class="el-icon-plus"/>
            <i v-else class="el-icon-minus"/>
          </span>
          <div v-if="iconShow(index,scope.row) && column.edit" @click="scope.row.edit[column.value] = !scope.row.edit[column.value]" :style="show_div_c"></div>
          <div v-else-if="column.edit" @click="scope.row.edit[column.value] = !scope.row.edit[column.value]" :style="show_div"></div>
          <template v-if="column.edit == true">
            <template v-if="scope.row.edit[column.value]">
              <el-input v-focus @blur="saveEdit(scope.row, column.value)" v-model="scope.row[column.value]" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ scope.row[column.value] }}</span><span style="opacity:0;" >1</span>
          </template>
          <template v-else>
            {{ scope.row[column.value] }}
          </template>
        </div>
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>
<style>
.edit-input{
width:80%;
}
.table_box{
position:relative;
}
</style>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
export default {
  name: 'TreeTable',
  data(){
    return{
      show_div_c:{
      background:'#fff',
      width:'80%',
      height:'100%',
      position:'absolute',
      top: 0,
      right:0,
      opacity:0
      },
      show_div:{
      background:'#fff',
      width:'100%',
      height:'100%',
      position:'absolute',
      top: 0,
      right:0,
      opacity:0
      }
    }
  },
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    height:{
      type: Number,
      default: 200
    },
    showIncoIndex:{
      type: Number,
      default: 0
    },
    showIndentIndex:{
      type: Number,
      default: 0
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let that = this
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      that.addEdit(tmp, that)
      return tmp
    }
  },
  directives: {
         focus:function (el) {
          el.children[0].focus()
         }
  },
  watch: {

  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      if(row.row.parent) {
        let childrenList = row.row.parent.children
        let cmap = {}
        childrenList.forEach(function(v){
          cmap[v.id] = v
        })
        if(!cmap[row.row.id]){
          row.row._show = true
        }
      }
      return row.row._show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    renderHeader(h,c, column) {
      let that = this
      let btn = column.head_button
      let content = [h('span', column.text + " ")]
      if(btn){
        let btnList = []
        btn.forEach(function(v){
          btnList.push(h('span', {
            class: 'iconfont ' + v.icon,
            on: {
              click: () => {
                v.excFun(c, that)
              }
            }
          }))
        })

        return h('span', content.concat(btnList))
      }else{
        return h('span', content)
      }
    },
    //添加是否显示编辑框
    addEdit(list, that){
      list.forEach(function(val){
        let columnsParamEdit = {}
        that.columns.forEach(function(val){
          if(val.edit){
            columnsParamEdit[val.value] = false
          }
        })
        that.$set(val, 'edit', columnsParamEdit)
        if(val.children){
          that.addEdit(val.children, that)
        }
      })
    },
    saveEdit(row, val){
      row.edit[val] = false
      if(row.menu){
        row.menu[val] = row[val]
      }
      if(row.excFun && row.bakFun){
        row.excFun(row).then(response => {
          row.bakFun(response)
        })
      }
    },
    excFun(fun, row){
      if(fun){
        let that = this
        fun(row, that)
      }
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex, row) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === this.showIncoIndex && record.children && record.children.length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
