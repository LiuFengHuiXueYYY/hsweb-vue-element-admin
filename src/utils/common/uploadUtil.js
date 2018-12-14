//list 拆分成逗号url
export function urlSplice(list){
  let str = '';
  if(list){
    list.forEach(function (value) {
      if(value){
        let uri = value.name
        if(uri){
          str += uri + ','
        }
      }
    })
  }
  return str
}

//url 合并成list
export function urlMerge(idList,token,uri){
  let list = []
  if(idList){
    idList.forEach(function (value) {
        if(value){
          let obj = {};
          obj.name = value;
          obj.url = uri + value + "?token=" + token;
          list.push(obj)
        }
    });
  }
  return list
}

//点击编辑时，图片触发的事件
export function urlUpdate(that,tempData){
  let imgList = that.imgFieldList
  if(imgList){
    imgList.forEach(function (fieldName) {
      let field = urlSplice(that[fieldName + 'List'])
      tempData[fieldName] = field
      that.temp[fieldName] = field
    });
  }
}

//图片生命周期内的函数
export function imgCreated(that){
  let imgList = that.imgFieldList
  if(imgList){
    imgList.forEach(function (fieldName) {
      that[fieldName + 'List'] = [];
    });
  }
}

//图片显示的函数 imgFieldList是必需的，为数组，值为后台图片存储字段
export function imgUrlGen(that, row){
  let token = that.token
  let uri = that.downloadBaseUrl
  let imgList = that.imgFieldList
  imgList.forEach(function (fieldName) {
    let field = row[fieldName];
    if(field){
      that[fieldName + 'List'] = urlMerge(field.split(','),token,uri)
    }else{
      that[fieldName + 'List'] = [];
    }
  });
}

//图片全部清空
export function imgEmpty(that){
  that.imgFieldList.forEach(function (fieldName) {
    that[fieldName + 'List'] = [];
  });
}
