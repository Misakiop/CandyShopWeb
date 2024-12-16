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

//更新用户数据
export function updateUserInfo(userData) {
    return axios.put(`/api/admin/update`, userData, {
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



// 商品相关------------------------------------------------------------
//====================================================================
//分页获取商品数
export function getcandy(pageNum, pageSize) {
    return axios.get("/api/candy/list", {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

//分页查找商品
export function getcandyByname(pageNum, pageSize, name) {
    return axios.get(`/api/candy/selectbyname/${name}`, {
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    });
}

//修改商品数据
export function updateCandy(candyData) {
    return axios.put(`/api/admin/updateshop`, candyData, {
        params: {
            id: candyData.id
        }
    });
}

//修改商品状态
// export function updateCandySta(candyData) {
//     return axios.put(`/api/admin/updatestate`, candyData, {
//         params: {
//             id: candyData.id
//         }
//     });
// }

//添加商品
export function addCandy(candyData) {
    return axios.post('/api/admin/insert', candyData);
  }
  
//删除商品
export function deleteCandy(id){
    return axios.delete(`/api/admin/deleteshop/${id}`)
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
// 添加购物车
export function addToCart(cartItem) {
    return axios.post('/api/cart/add', cartItem);
}







