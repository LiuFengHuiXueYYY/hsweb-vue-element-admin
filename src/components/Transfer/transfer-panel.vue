<template>
  <div class="el-transfer-paneles">
      <tree-table :showIncoIndex="showIncoIndex" :showIndentIndex="showIndentIndex" @getRow="getRow" :height="height" :data="datas" :columns="columns" border/>
  </div>
</template>
<style>
.el-transfer-paneles{
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: auto;
    background: #fff;
    display: inline-block;
    vertical-align: middle;
    width: 46%;
    height:100%;
    margin-right:2%;
    margin-left: 1.5%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
}
</style>
<script>
  import treeTable from '@/components/TreeTable'
  export default {
    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      treeTable
    },

    props: {
      datas:{
        type: Array,
        default: () => []
      },
      columns: {
        type: Array,
        default: () => []
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

    data() {
      return {
      };
    },

    watch: {

    },

    computed: {
    },

    methods: {
      getRow(row){
        this.$emit('getRow',row);
      }
    }
  };
</script>
