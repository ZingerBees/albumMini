// components/Tabs/tabs.js
Component({
  properties:{
    tabs:{
      type: Array,
      value: []
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  methods: {
    handleItemTap(e){
      // 1 获取点击的tab索引
      const { index } = e.currentTarget.dataset;
      // 2 触发 父组件中的事件，传递数据给父组件  把当前点击的index数据传给父组件
      this.triggerEvent("tabsItemChange", { index: index });
    }
  }
})