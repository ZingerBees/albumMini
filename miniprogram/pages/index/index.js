// pages/index/index.js
Date.prototype.format = function(type){
  let year = this.getFullYear()
  let month = this.getMonth()
  let day = this.getDate()
  switch(type){
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    default:
      return `${year}${month}${day}`
  }
}
Page({
  // 页面的初始数据
  data: {
    tabsList:[
      {id:0, value:"网盘文件",isActive: true},
      {id:1, value:"我",isActive: false}
    ],
    imgList:[],
    visible: false,
    uploadVisible: false,
    imgInfo:{},
    userInfo:{}
  },
  // 子组件emit处理的事件
  getTabsItemChange(e){
    const _this = this
    const { index } = e.detail;
    // 拿到data中叫做 tabsList 数据，复制出一份用来修改
    let { tabsList } = this.data;
    tabsList.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabsList
    })
    if(index == 1) {
      wx.getUserProfile({
        desc: '获取信息原因',
      }).then(res=>{
        _this.setData({
          userInfo: res.userInfo
        })
      })
    }
  },
  moreOperate(e){
    let { imginfo } = e.target.dataset
    this.setData({
      imgInfo: imginfo ? imginfo : {},
      visible: true
    })
  },
  upload(){
    this.setData({
      uploadVisible: true
    })
  },
  uploadImage(){
    const _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const db = wx.cloud.database()
        const tempFilePaths = res.tempFilePaths[0]
        db.collection('Images').add({
          data:{
            isDir: "0",
            dirName: "测试",
            createTime: new Date().format('YYYY-MM-DD'),
            filePath: tempFilePaths
          }
        }).then(addRes=>{
          wx.showToast({
            title: '上传成功',
          })
          _this.setData({
            uploadVisible: false
          })
          _this.getImgList()
        })
      }
    })
  },
  // 新建文件夹
  makedir(){
    const _this = this
    const db = wx.cloud.database()
    wx.showModal({
      title: '新建文件夹',
      editable: true,
      success(res){
        if(res.cancel) return
        db.collection("Images").add({
          data:{
            isDir: "1",
            dirName: res.content,
            createTime: new Date().format('YYYY-MM-DD'),
            filePath: "",
            children:[]
          }
        }).then(data=>{
          wx.showToast({
            title: '创建成功',
          })
          _this.setData({
            uploadVisible: false
          })
          _this.getImgList()
        })
      }
    })
  },
  rename(){
    const _this = this
    wx.showModal({
      title: '重命名',
      editable: true,
      success(res){
        const db = wx.cloud.database()
        db.collection('Images').doc(_this.data.imgInfo._id).update({
          data: {dirName: res.content},
          success(){
            wx.showToast({
              title: '修改成功',
            })
            _this.setData({
              visible: false
            })
            _this.getImgList()
          }
        })
      }
    })
  },
  del(){
    const _this = this
    const db = wx.cloud.database()
    db.collection('Images').doc(this.data.imgInfo._id).remove({
      success(res){
        wx.showToast({
          title: '删除成功',
        })
        _this.setData({
          visible: false
        })
        _this.getImgList()
      }
    })
  },
  clickRow(e){
    let imginfo = e.currentTarget.dataset.imginfo
    if(e.currentTarget.dataset.imginfo.isDir==0){// 文件
      wx.previewImage({
        urls: [imginfo.filePath],
      })
    }
  },
  getImgList(){
    const _this = this
    const db = wx.cloud.database();
    db.collection('Images').get().then(res=>{
      _this.setData({
        imgList: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getImgList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})