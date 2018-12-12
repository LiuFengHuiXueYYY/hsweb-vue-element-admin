<script>
    export default {
      // 声明 props
      props: ['title'],
      // 同样也可以在 vm 实例中像 “this.message” 这样使用
      template: '<div style="width:100%;height:30px;margin-bottom:25px;border-bottom: 1px solid #ddd;"><span  class="el-dialog__title">{{title}}</span></div>'
    }
</script>
