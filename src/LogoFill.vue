<template>

    <div>
        <input type="file" @change="changeFile"/>
          <img :src="imgSrc"/>

        <a style="width:5rem;height:3rem;background:yellow;" @click="parseImg">识别图片</a>
        <div>正在扫描Logo,扫描进度:{{progress}}</div>
        <div>
            <label> 显示耗时</label><input v-model="showTime" />
            <label> 显示次数</label><input v-model="showCount" />
        </div>
        <div>
            <a @click="reDraw()" style="width:80px;text-align:center;background:red;border-radius:7px;padding:4px 7px;">重新绘制</a>
        </div>
        <div style="position:relative;">
            <div :style="{position:'absolute',height:item.height+'px',width:item.width+'px',left:item.left+'px',top:item.top+'px',background:'red'}" v-for="item in showColorsArr"></div>
        </div>
    </div>
</template>

<script>
    import ImgColor from './ImageAnalysis'
    export default{
        name:'vue-logo-fill',
        data(){
            return {
                imgSrc:null,
                parseImgObjfn:null,
                progress:'0%',
                showColorsArr:[],
                tempColorArr:[],
                backupArr:[],
                showStyle:null,
                showTime:5,
                showCount:2, //几次显示完毕
                timeFlag:null
            }
        },
        methods:{
            changeFile:function(event){
                 let self=this;
                let file = event.target.files[0]
                console.log(file);
                let fr = new FileReader();
                fr.onload = (e)=>{
                    self.imgSrc = e.target.result;
                    let n_img = new Image();
                    n_img.src = e.target.result;
                    n_img.onload=(e)=>{
                        console.log(n_img.width,n_img.height);

                        var temp=new ImgColor(n_img,self);
                        self.parseImgObjfn= temp;
                    }
                }


                fr.readAsDataURL(file)
            },
            parseImg:async function(){
                var self=this;
                console.log(this.parseImgObj);

                let runFlag=setInterval(function(){
                    console.log(self.parseImgObjfn.progress);
                    var process=self.parseImgObjfn.progress;
                    self.progress=process;
                    if("100%"==process){
                        clearInterval(runFlag);
                    }
                },1000)
                let data=await this.parseImgObjfn.getMColors();
                let divInfoData=this.parseImgObjfn.getCreateImageInfo(data);
               this.tempColorArr=divInfoData;
                this.startShow();
            },
            randonPicker:function(){

              ///随机取数
                let min=0;
                let max=this.tempColorArr.length-1;
                let rnum=this.randomNum(min,max);
                let obj=this.tempColorArr.splice(rnum,1);
                if(obj&&obj.length>0){
                    this.backupArr.push(obj[0]);
                    return obj[0];
                }else{
                    return null;
                }

            },
            randomNum:function randomNum(minNum,maxNum){
                    switch(arguments.length){
                        case 1:
                            return parseInt(Math.random()*minNum+1,10);
                            break;
                        case 2:
                            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                            break;
                        default:
                            return 0;
                            break;
              }
            },
            reDraw:function(){
                this.showColorsArr=[];
                this.tempColorArr=this.backupArr;
                this.startShow();
            },
            startShow:function(){
                var self=this;
                var time=this.showTime/this.showCount;
                var pageCount=this.tempColorArr.length/this.showCount;
                debugger;
                var count=0;
                  debugger;
             //   console.log(self.showColorsArr);
             this.timeFlag=setInterval(function(){
                    for(var i=0;i<pageCount;i++){
                        let temp=self.randonPicker();
                        if(temp&&temp.height){
                            self.showColorsArr.push(temp);
                        }else{
                            debugger;
                            console.log("不存在得数据:",temp);
                            break;
                            clearInterval(self.timeFlag);
                        }

                    }
                 count++;
                  if(count==self.showCount){
                      clearInterval(self.timeFlag);
                  }

              },time*1000);
            }
        },
        watch:{
            showStyle(vakue,oldValue){
                this.showColorsArr=[];
            }
        }
    }

</script>