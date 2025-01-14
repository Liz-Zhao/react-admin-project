const routesConfig = [
    {
        path:'/dashboard',
        element: 'Dashboard',
        name:'报表',
        icon:'DashboardIcon',
        hidden: false,
        subMenu:null,
    },
    {
        path:'',
        element:'',
        name:'商品管理',
        icon: 'LocalMallIcon',
        hidden:false,
        subMenu:[
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
                subMenu:null,
            },
            {
                path:'/shop_add',
                element: 'AddShop',
                name:'商品zeng',
                icon:'',
                hidden: true,
                subMenu:null,
            },
        ]
    },
    {
        path:'',
        element:'',
        name:'订单管理',
        icon: 'GavelIcon',
        hidden:false,
        subMenu:[
            {
                path:'/order',
                element: 'Order',
                name:'订单管理',
                icon:'GavelIcon',
                hidden: false,
                subMenu:null,
            },
            {
                path:'/order/:id',
                element: 'OrderDetial',
                name:'订单详情',
                icon:'',
                hidden: true,
                subMenu:null,
            },
        ]
    },
    {
        path:'/user',
        element: 'UserInfo',
        name:'个人信息',
        icon: 'AccessibilityIcon',
        hidden: false,
        subMenu:null,
    },
    {
        path:'',
        element:'',
        name:'权限管理',
        icon: 'AccessibilityIcon',
        hidden:false,
        subMenu:[
            {
                path:'/permission',
                element: 'Permission',
                name:'权限管理',
                icon: 'AccessibilityIcon',
                hidden: false,
                subMenu:null,
            },
            {
                path:'/permission_add',
                element: 'AddPermission',
                name:'角色新增',
                icon: '',
                hidden: true,
                subMenu:null,
            },
            {
                path:'/permission/:id',
                element: 'AddPermission',
                name:'角色新增',
                icon: '',
                hidden: true,
                subMenu:null,
            },
            {
                path:'/permission/:id/users',
                element: 'ConnectUser',
                name:'关联用户',
                icon: '',
                hidden: true,
                subMenu:null,
            }
        ]
    },
    
]

export default routesConfig;