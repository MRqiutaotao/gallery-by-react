require('normalize.css/normalize.css');
require('styles/App.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关信息
let imageDatas = require('../data/imageDatas.json');
//利用自执行函数，获取图片路径
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas)

class ImgFigure extends Component {
  render() {
    let styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.desc} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr:[]
    }
  }
   Constant={
    centerPos: {
      left: 0,
      right: 0
    },
    hPostRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPostRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  }
  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.ImgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);
    //计算中心图片的位置点；
    this.Constant.centerPos={
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    };
    this.Constant.hPostRange.leftSecX[0]=-halfImgW;
    this.Constant.hPostRange.leftSecX[1]=halfStageW-halfImgW*3;
    this.Constant.hPostRange.rightSecX[0]=halfStageW+halfImgW;
    this.Constant.hPostRange.rightSecX[1]=stageW-halfImgW;
    this.Constant.hPostRange.y[0]=-halfImgH;
    this.Constant.hPostRange.y[1]=stageH-halfImgH;
    this.Constant.vPostRange.topY[0]=-halfImgH;
    this.Constant.vPostRange.topY[1]=halfStageH-halfImgH*3;
    this.Constant.vPostRange.x[0]=halfStageW-imgW;
    this.Constant.vPostRange.x[1]=halfStageW;

    this.rearrange(0)
  }
  //随机取出范围以内的值
  getRangeRandom(low,high){
    console.log(low,high,"debug");
    return Math.ceil(Math.random()*(high-low)+low)
  }
  //重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr=this.state.imgsArrangeArr;
    let Constant=this.Constant;
    let centerPos=Constant.centerPos;
    let hPostRange=Constant.hPostRange;
    let vPostRange=Constant.vPostRange;
    let hPostRangeLeftSecX=hPostRange.leftSecX;
    let hPostRangeRightSecX=hPostRange.rightSecX;
    let hPostRangeY=hPostRange.y;
    let vPostRangeTopY=vPostRange.topY;
    let vPostRangeX=vPostRange.x;

    let imgsArrangeTopArr=[];
    let topImgNum=Math.ceil(Math.random()*2);//取一个或者不取
    let topImgSpliceIndex=0;
    let imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

    //首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos=centerPos;

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex =Math.ceil(Math.random()*imgsArrangeArr.length-topImgNum);
   imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

   //布局位于上侧图片
   imgsArrangeTopArr.forEach((value,index) => {
     imgsArrangeTopArr[index].pos={
       top:this.getRangeRandom(vPostRangeTopY[0],vPostRangeTopY[1]),
       left:this.getRangeRandom(vPostRangeX[0],vPostRangeX[1])
     }
   });

   //布局左右两侧的图片
   for(var i =0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
      var hPosRangeLORX=null;

      //前半部分布局左边，右半部分布局右边
      if(i<k){
        hPosRangeLORX = hPostRangeLeftSecX;
      }else{
        hPosRangeLORX = hPostRangeRightSecX;
      }

      imgsArrangeArr[i].pos={
        top:this.getRangeRandom(hPostRangeY[0],hPostRangeY[1]),
        left:this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
      }
   }

   if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
     imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
   }

   imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

   this.setState({
     imgsArrangeArr:imgsArrangeArr
   });


  }
  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.map((value, index) => {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} key={value.fileName} ref={"ImgFigure" + index} arrange={this.state.imgsArrangeArr[index]}></ImgFigure>)
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">{imgFigures}</section>
        <nav className="controller-nav">{controllerUnits}</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
