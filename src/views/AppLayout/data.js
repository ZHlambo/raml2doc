module.exports = [
  {
    "name": "首页",
    "value": "/"
  }, {
    "name": "商品",
    "child": [
      {
        "name": "分类管理",
        "value": "/index/cat"
      }, {
        "name": "商品管理",
        "value": "/index/item"
      }
    ]
  }, {
    "name": "订单",
    "child": [
      {
        "name": "订单管理",
        "value": "/order_ordermanager"
      }, {
        "name": "运费管理",
        "value": "/order_freightchargemanage"
      }
    ]
  }
]
