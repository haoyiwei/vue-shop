<template>
<div>
  <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 添加用户框 -->
  <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="resetForm()">
    <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" show-password>
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
  </el-dialog>
  <!-- 修改用户弹框 -->
  <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm()">
    <el-form :rules="editFormRules" ref="editUserRef" :model="editForm" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="xiugai()">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 卡片区 -->
  <el-card class="box-card">
    <!-- gutter 是指两个el-col之间的间距 -->
    <el-row :gutter="20">
      <!-- span  指每个 el-col 的宽度-->
      <el-col :span="8">
        <el-input placeholder="请输入搜索内容" class="input-with-select" v-model="querycdt.query" clearable @clear="search()" @keyup.enter.native="search()">
          <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- :data 数据遍历  border表格边框线  stripe 斑马效果各行换色-->
    <el-table stripe border :data="userlist" style="width: 100%">
      <!-- prop 数据要显示的字段 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" width="160"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" width="130"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="60">
        <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="info">
        <el-button type="success" icon="el-icon-edit" size="mini" @click="showEditDialog(info.row.id)"></el-button>

        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deluser(info.row.id)"></el-button>
        <el-tooltip class="item" effect="dark" content="添加角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
</template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="querycdt.pagenum"
     :page-sizes="[2, 5, 10, 20]"
     :page-size="2"
     layout="total, sizes, prev, pager, next, jumper"
       :total="tot"
    >
       </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    // 修改用户段 
    // 显示 修改弹框
    async showEditDialog(id) {
      // 显示弹框
      this.editDialogVisible = true
      const {
        data: res
      } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    // 重置form表单
    resetEditForm() {
      this.$refs.addFormRef.resetFields()
    },
    xiugai() {
      // 表单校验
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          // axios获得并传递数据到服务器端
          const {
            data: dt
          } = await this.$http.put('users/' + this.editForm.id, this.editForm)
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 修改成功(提示、关闭对话框、更新页面数据)
          this.$message.success(dt.meta.msg)
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    // 修改操作结束
    // 删除用户 段 方法
    deluser(id) {
      this.$confirm('确定要删除吗', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          // 通过axios 发送请求 删除对应行数据
          const {
            data: dt
          } = await this.$http.delete('users/' + id)
          console.log(dt)
          // 删除判断 和提示
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          // 判断当前页面数据是不是只有一条 如果只有一条就把页码减一
          if (this.userlist.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.getUserList()
        })
        .catch(() => {})
    },
    // 删除结束
    // 添加用户 段 方法
    tianjia() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const {
            data: dt
          } = await this.$http.post('users', this.addForm)
          // console.log(dt)
          // 判断数据添加失败 提示信息
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 如果添加数据成功 关闭弹窗 提示数据成功 刷新数据
          this.dialogVisible = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    // 重置form表单
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    search() {
      this.getUserList()
    },
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getUserList()
    },
    async getUserList() {
      const {
        data: dt
      } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // console.log(dt.data.users)
      this.tot = dt.data.total
      this.userlist = dt.data.users
    }
  },
  data() {
    var checkmobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    return {
      addFormRules: {
        username: [{
          required: true,
          message: '用户名必填',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码必填',
          trigger: 'blur'
        }],
        mobile: [{
            required: true,
            message: '手机号必填',
            trigger: 'blur'
          },
          {
            validator: checkmobile,
            trigger: 'blur'
          }
        ]
      },
      // 修改数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        mobile: [{
            required: true,
            message: '手机号必填',
            trigger: 'blur'
          },
          {
            validator: checkmobile,
            trigger: 'blur'
          }
        ]
      },
      // 添加数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户弹框
      dialogVisible: false,
      // 修改用户弹框
      editDialogVisible: false,
      // 总页码数
      tot: 0,
      // 每页显示的数据项
      userlist: [],
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
