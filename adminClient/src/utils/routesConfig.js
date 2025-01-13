const routesConfig = [
    {
        path:'/dashboard',
        element: 'Dashboard',
        name:'报表',
        icon:'DashboardIcon',
        hidden: false,
    },
    {
        path:'/shopcate',
        element: 'ShopCategory',
        name:'商品类型',
        icon: 'ShopTwoIcon',
        hidden: false,
    },
    {
        path:'/shop',
        element: 'Shop',
        name:'商品',
        icon:'LocalMallIcon',
        hidden: false,
    },
    {
        path:'/shop/:id',
        element: 'AddShop',
        name:'商品详情',
        icon:'',
        hidden: true,
    },
    {
        path:'/shop_add',
        element: 'AddShop',
        name:'商品zeng',
        icon:'',
        hidden: true,
    },
    {
        path:'/order',
        element: 'Order',
        name:'订单管理',
        icon:'GavelIcon',
        hidden: false,
    },
    {
        path:'/order/:id',
        element: 'OrderDetial',
        name:'订单详情',
        icon:'',
        hidden: true,
    },
    {
        path:'/user',
        element: 'UserInfo',
        name:'个人信息',
        icon: 'AccessibilityIcon',
        hidden: false,
    },
    {
        path:'/permission',
        element: 'Permission',
        name:'权限管理',
        icon: 'AccessibilityIcon',
        hidden: false,
    },
    {
        path:'/permission_add',
        element: 'AddPermission',
        name:'角色新增',
        icon: '',
        hidden: true,
    },
    {
        path:'/permission/:id',
        element: 'AddPermission',
        name:'角色新增',
        icon: '',
        hidden: true,
    }
]

export default routesConfig;