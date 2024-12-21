  <template>
    <el-row justify="center">
      <div style="width: 100%; height: 100%; padding: 16px; box-sizing: border-box;">
        <div style="background-color: #aaabbc; width: 100%; height: 300px; border-radius: 30px; padding: 16px;">
          <div style="margin-top: 25px; margin-left: 35px;">
            <el-text style="font-size: 50px; color: white; letter-spacing: 3px;" class="font-bold">下午好,</el-text><br>
            <el-text style="font-size: 50px; color: white; letter-spacing: 3px;" class="font-bold">{{
              Atuserinfo.username }}</el-text>
          </div>
        </div>
        <div style=" width: 100%; height: 400px; border-radius: 30px; padding: 16px;">
          <el-row justify="center">
            <el-col :span="8">
              <el-statistic title="商城订单" :value="totalOrders" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="商城用户" :value="totalItems" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="商城商品数据" :value="totalCandys" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllOrders, getcandy, getinfo } from '../../../api/manager';

const Atuserinfo = ref({});
const totalItems = ref(0);
const totalOrders = ref(0);
const totalCandys = ref(0);

// 组件挂载后执行的函数，初始化商品列表
onMounted(() => {
  const AtuserinfoStr = sessionStorage.getItem("Atuserinfo");
  if (AtuserinfoStr) {
    try {
      const user = JSON.parse(AtuserinfoStr);
      Atuserinfo.value = user; // 更新响应式数据
    } catch (error) {
      console.error('无法从 sessionStorage 解析 Atuserinfo：', error);
    }
  }

  fetchUserList(); fetchOrderList(); fetchCandyList();
});

// 获取用户列表数据
const fetchUserList = () => {
  getinfo()
    .then((res) => {
      totalItems.value = res.data.total;  // 设置总记录数
    })
    .catch((err) => {
      console.error(err);
    });
};

// 获取订单列表数据
const fetchOrderList = () => {
  // 获取订单数据
  getAllOrders()
    .then((res) => {
      totalOrders.value = res.data.total;
    })
    .catch((err) => {
      console.error(err);
    });
};

// 获取商品列表数据
const fetchCandyList = () => {
  getcandy()
    .then((res) => {
      totalCandys.value = res.data.pageInfo.total;
    })
    .catch((err) => {
      console.error(err);
    });
};

</script>

<style>
.el-col {
  text-align: center;
}
</style>