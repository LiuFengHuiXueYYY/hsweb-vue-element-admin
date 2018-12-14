<template>
  <div class="el-transfer">
    <transfer-panel :showIncoIndex="showIncoIndex" :showIndentIndex="showIndentIndex" @getRow="getRowLeft" :height="height" :datas="datasLeft" :columns="columnLefts">

    </transfer-panel>

    <transfer-panel :showIndentIndex="showIndentIndex" :showIncoIndex="showIncoIndex" @getRow="getRowRight" :height="height" :datas="datasRight" :columns="columnRights">

    </transfer-panel>
  </div>
</template>

<script>
  import { buildTree } from '@/utils/common/treeUtil'
  import TransferPanel from './transfer-panel.vue';
  export default {
    name: 'ElTransfer',

    components: {
      TransferPanel
    },
    data() {
      return {
        datasLeft: [],
        datasRight: [],
        datasLeftList: [],
        datasRightList: []
      }
    },
    props: {
      datasRightTmp:{
        type: Array,
        default: () => []
      },
      datasLeftTmp:{
        type: Array,
        default: () => []
      },
      columnsRight: {
        type: Array,
        default:() => []
      },
      columnsLeft: {
        type: Array,
        default:() => []
      },
      columns: {
        type: Array,
        default:() => []
      },
      height:{
        type: Number,
        default: 400
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
    //.concat()
    computed: {
      columnLefts:function(){
        let that = this
        let rl = []
        that.columnsLeft.forEach(function(val){
          if(val.value=='editBtn'){
            val.button[0].excFun = that.getRowLeft
          }
        })
        return that.columnsLeft
      },
      columnRights:function(){
        let that = this
        let rl = []
        that.columnsRight.forEach(function(val){
          if(val.value=='editBtn'){
            val.button[0].excFun = that.getRowRight
          }
        })
        return that.columnsRight
      }
    },

    watch: {
      datasRightTmp: function(c, o){
        this.datasRight = buildTree(this.datasRightTmp)
        this.datasRightList = this.datasRightTmp
      },
      datasLeftTmp: function(c, o){
        this.datasLeft = buildTree(this.datasLeftTmp)
        this.datasLeftList = this.datasLeftTmp
      }
    },
    created() {

    },
    methods: {
      getRowLeft: function(row){
        let that = this
        let list = that.getTreeList(row)
        let datasRightList = that.datasRightList
        let datasLeftList = that.datasLeftList
        let leftMap = {}
        for(const v of datasLeftList){
          let id = v.id
          if(v.menu){
            id = v.menu.id
          }
          leftMap[id] = v
        }
        for(const v of list){
          let id = v.id
          if(v.menu){
            id = v.menu.id
          }
          if(leftMap[id]){
            that.spliceAll(datasLeftList, v)
            datasRightList.push(v)
          }
        }
        that.datasRight = buildTree(datasRightList)
        that.datasLeft = buildTree(datasLeftList)
      },
      getRowRight: function(row){
        let that = this
        let list = that.getTreeList(row)
        let datasRightList = that.datasRightList
        let datasLeftList = that.datasLeftList
        let rightMap = {}
        for(const v of datasRightList){
          let id = v.id
          if(v.menu){
            id = v.menu.id
          }
          rightMap[id] = v
        }
        for(const v of list){
          let id = v.id
          if(v.menu){
            id = v.menu.id
          }
          if(rightMap[id]){
            that.spliceAll(datasRightList, v)
            datasLeftList.push(v)
          }
        }
        that.datasRight = buildTree(datasRightList)
        that.datasLeft = buildTree(datasLeftList)
      },
      getTreeList(row, l){
        let list = []
        if(l){
          list = l
        }
        let children = row.children
        if(children && children.length > 0){
          for(const v of children){
            if(children && children.length > 0){
              this.getTreeList(v, list)
            }else{
              list.push(v)
            }
          }
        }
        list.push(row)
        return list
      },
      spliceAll(list, v){
        let that = this
        list.splice(list.indexOf(v), 1)
        list.forEach(function(val){
          if(val.children){
            that.spliceAll(val.children, v)
          }
        })
      }
    }
  };
</script>
