require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关信息
let imageDatas=require('../data/imageDatas.json');
//利用自执行函数，获取图片路径
imageDatas=(function genImageURL(imageDatasArr){
  for(var i=0;i<imageDatasArr.length;i++){
    var singleImageData=imageDatasArr[i];
    singleImageData=require('../images/'+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
})(imageDatas)


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
