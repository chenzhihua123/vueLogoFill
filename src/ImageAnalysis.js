// 封装函数库
const getColorXY = Symbol('getColorXY');
const getColors=Symbol('getColors');
const convertToObjByColumn=Symbol('convertToObjByColumn')
const createImgWithDiv=Symbol('createImgWithDiv')
export default  class ImgColor{
    constructor(img,instance){
        this.canvas = document.createElement("canvas")
        this.canvas.width = img.width
        this.canvas.height = img.height
        this.cvs = this.canvas.getContext("2d")
        this.cvs.drawImage(img, 0, 0)
        this.accuracy = 5
        this.progress = '',
        this.isAuto=true;
        this.instance=instance;
        this.data=[];
    }
    [getColorXY](x,y){
        let obj = this.cvs.getImageData(x, y, 1, 1)
        let arr = obj.data.toString().split(",")

        let first = parseInt(arr[0]).toString(16)
        first = first.length === 2 ? first : first + first

        let second = parseInt(arr[1]).toString(16)
        second = second.length === 2 ? second : second + second

        let third = parseInt(arr[2]).toString(16)
        third = third.length === 2 ? third : third + third

        let last = parseInt(arr.pop()) / 255
        last = last.toFixed(0)
        if(arr[0]!=255&&arr[1]!=255&&arr[2]!=255){
            var robj={row:x,col:y};
            this.data.push(robj)
        }
        let color = {}
        color['rgba'] = 'rgba(' + arr.join(',') + ',' + last + ')'
        color['#'] = '#' + first + second + third

        return color
    }
    [getColors](){
        return (new Promise((resolve, reject) => {

            let arr = []
            let getY = (i) => {
                for(let j = 0; j < this.canvas.height; j++) {
                    let obj = {}
                    obj = this[getColorXY](i, j)
                    obj.index = 1
                    let is = true

                    arr.forEach((item) => {
                        if (item['#'] === obj['#']) {
                            is = false
                            item.index += 1
                        }

                        let l = []

                        for (let i = 0; i < obj['#'].length; i++) {

                            if (item['#'].indexOf(obj['#'][i]) > -1) {
                                l.push('1')
                            }
                        }

                        let acc = (this.accuracy > 7) ? 7 : this.accuracy
                        acc = (this.accuracy < 1) ? 2 : this.accuracy
                        if (l.length > acc) {
                            is = false
                            item.index += 1
                        }
                    })

                    if (is) {
                        arr.push(obj)
                    }
                }
            };

            let getX = (i) => {
                if (i < this.canvas.width) {

                    getY(i)
                    this.progress = (i / this.canvas.width * 100).toFixed(2) + '%'
                   // console.log(this.progress)
                    setTimeout(() => {
                        getX(++i)
                    }, 20)

                } else {

                    this.progress = '100%'
                   // console.log( this.progress )

                    resolve(arr.sort(function(a, b) {
                        return a.index < b.index ? 1 : (a.index > b.index ? -1 : 0)
                    }))
                }
            };

            getX(0)

        }))
    }
    async getMColors(){

             let colorData=await this[getColors]();
             let convertData={};//数据进行一次转换
             if(this.isAuto){
                 convertData=this[convertToObjByColumn](this.data);
                 console.log(convertData);
             }
             return convertData;



    }
    [convertToObjByColumn](colorData){
        let obj={};
        let min=10000000;
        let max=0;
        for(let i=0;i<colorData.length;i++){
            let temp=colorData[i];
            if(!obj[temp.col]){
                obj[temp.col]=[];
                obj[temp.col].push(temp.row);
            }else{
                obj[temp.col].push(temp.row);
            }

            if(min>temp.col){
                min=temp.col;
            }
            if(max<temp.col){
                max=temp.col;
            }
        }
        obj.min=min;
        obj.max=max;
        return obj;
    }
    [createImgWithDiv](data){
        var vailpx=5;
        var tempData={};
        var i_w=5;
        var i_h=5;
        var min=data.min;
        var max=data.max;
        var divArr=[];
        var block=0;
        for(let i=min;i<max;){
            let temp=data[i];

            if(!temp){
                i++;
                continue;
            }
            if(temp.length<i_w){
                i++
            }else{

                var max=temp[temp.length-1];
                var columnObj={};
                for(let l in temp){
                    columnObj[temp[l]]=temp[l]
                }


                for(let columnIndex=temp[0];columnIndex<max;){
                    let rwidthpos=columnIndex+i_w;
                    let exitsNum=0;

                    ///判断columnIndex是否在范围内，如果没有在有效范围，向后查找

                    let temp_=null;
                    ///当前位置向前查找指定像素点，看是否存在空白节点结束后的其实点
                    for(let k=0;k<vailpx;k++){

                        let tempColumnIndex=columnIndex-k;
                        if(!columnObj[tempColumnIndex]){
                            if(temp_){
                                columnIndex=temp_;
                            }
                            break;
                        }
                        temp_=tempColumnIndex;
                    }



                    while(!columnObj[columnIndex]&&columnIndex<max){
                        columnIndex++;
                    }
                    rwidthpos=columnIndex+i_w;
                    ////判断start 跟end是否都存在这个数值
                    for(let t=columnIndex;t<=rwidthpos;t++){
                        let isExit=temp.indexOf(t);
                        if(isExit>=0){
                            exitsNum++
                        }
                    }
                    if(exitsNum>=5){
                        ++block
                        let temp={top:i,left:columnIndex,position:'absolute',width:i_w,height:i_h,'data-block':block}
                        divArr.push(temp);
                    }
                    columnIndex=columnIndex+i_w;

                }


                i=i+i_h;
            }
        }
        return divArr;
    }
    getCreateImageInfo(data){

        return this[createImgWithDiv](data);
    }



}


