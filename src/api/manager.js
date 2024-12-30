import axios from '../axios'

//登录
export function login(username, password) {
    return axios.post("/api/auth/login", {
        username,
        password
    })
}

//注册
export function regist(username, password) {
    return axios.post("/api/auth/register", {
        username,
        password
    })
}

// 用户相关------------------------------------------------------------
//====================================================================
//获取用户数据
export function getinfo(pageNum, pageSize) {
    return axios.get("/api/user/userlist", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    })
}

export function getcandyUser(pageNum, pageSize) {
    return axios.get("/api/candy/listwhereuser", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

//更新用户数据
export function updateUserInfo(userData) {
    return axios.put(`/api/user/update`, userData, {
        params: {
            id: userData.id
        }
    });
}

//名称查找用户
export function getUserByName(username) {
    return axios.get(`/api/user/selectbyname/${username}`)
}

//注销用户
export function deleteUser(id) {
    return axios.delete(`/api/user/delete/${id}`)
}

//清空缓存
export function reloadUser(){
    return axios.delete(`/api/user/clearCache`)
}

// 商品相关------------------------------------------------------------
//====================================================================
//分页获取全部商品数
export function getcandy(pageNum, pageSize) {
    return axios.get("/api/candy/listwhere", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

//用户分页获取全部商品数
export function getcandyuser(pageNum, pageSize) {
    return axios.get("/api/candy/listwhereuser", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

//名称搜索商品
export function getcandyByWhere(pageNum, pageSize, name,) {
    return axios.get('/api/candy/listwherebyname', {
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
            name: name,  // 商品名称
        }
    });
}

//用户名称搜索商品
export function getcandyByWhereuser(pageNum, pageSize, name,) {
    return axios.get('/api/candy/listwherebynameuser', {
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
            name: name,  // 商品名称
        }
    });
}

// 按分类筛选商品
// export function getcandyByCategory(pageNum, pageSize, categoryId) {
//     return axios.get('/api/candy/listwherebyname', {
//         params: {
//             pageNum: pageNum,
//             pageSize: pageSize,
//             categoryId: categoryId || null, // 如果没有分类 ID，则为 null
//         }
//     });
// }



//修改商品数据
export function updateCandy(candyData) {
    return axios.put(`/api/admin/updateshop`, candyData, {
        params: {
            id: candyData.id
        }
    });
}

//添加商品
export function addCandy(candyData) {
    return axios.post('/api/admin/insert', candyData);
  }
  
//删除商品
export function deleteCandy(id){
    return axios.delete(`/api/admin/deleteshop/${id}`)
}

//清空缓存
export function reloadCandy(){
    return axios.delete(`/api/candy/clearCache`)
}


// 图片相关------------------------------------------------------------
//====================================================================
// 上传图片
export function uploadPicture(file) {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post("/api/file/uploadPicture");
}


// 购物车相关------------------------------------------------------------
//====================================================================
//分页获取购物车
export function getcarts(pageNum, pageSize) {
    return axios.get("/api/cart/list", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

// 添加购物车
export function addToCart(cartItem) {
    return axios.post('/api/cart/add', cartItem);
}

// 删除购物车
export function delToCart(idArr) {
    return axios.post('/api/cart/delete', idArr)
}

// 订单相关------------------------------------------------------------
//====================================================================
//提交订单
export function createOrder(order) {
    return axios.post('/api/order/create', order)
}

//分页获取商品数
export function getAllOrders(pageNum, pageSize) {
    return axios.get("/api/order/list", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

//id查找订单
export function getOrderById(id) {
    return axios.get(`/api/order/select/${id}`)
}

//修改订单
export function updateOrder(orderData){
    return axios.post(`/api/order/update`, orderData);
}

//删除订单
export function deleteOrder(id){
    return axios.delete(`/api/order/delete/${id}`)

}

//清空缓存
export function reloadOrder(){
    return axios.delete(`/api/order/clearCache`)
}






