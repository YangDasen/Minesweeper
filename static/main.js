var arrFirst;
var arrSecond;
arrFirst = new Array();
arrSecond = new Array();
var mineNum = 0;


var Cell = {
    createNew: function(x, y, num, mine, count) {
        var c = {
            x: x,
            y: y,
            num: num,
            flag: false,     // 用户标记
            count: count,    // 周围雷数
            mine: mine,      // 自己是否是雷
            opened: false,
            toClassName: function() {
                if (this.mine)
                    return "mine";
            }
        }
        return c;
    }
};

function shuffle(a) {   
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

var Game = {
    table: null,
    cells: null,
    mine_count: 9,
    w: 9,
    h: 9,
    init: function (e) {
        this.table = e;
        var self = this;
        
        this.table.find("td").each(function (index, e){
            $(this).bind('click', self.cellClick);
            $(this).bind('contextmenu', self.cellRightClick);
            $(this).bind('mouseover',self.mouseOver);
            //$(this).attr('id', index);
        });

        // TODO: call in "start game" button click
        this.start();

         $("#reset").on("click",function () {
            location.reload();
         });
    },


    die: function(){
        for(var i=0; i<this.cells.length; i++) {
            if (this.cells[i].mine) {
                $("[name= "+i+"]").addClass('mine');
            } else {
                if(this.cells[i].count)
                    $('td#' + i).text(this.cells[i].count);
                $('td#' + i).addClass('count');
            }
        }
    },
    
    open: function(i){
        self = this;
        var s = this.cells[i].y+"_"+this.cells[i].x;
        var arrRow;
        arrRow = new Array();
        var arrTest = new Array();

        if(this.cells[i].count != 0){
            //console.log(this);
            $("#"+s+"").addClass('blank');
            this.cells[i].opened = true;
        }else
        if(this.cells[i].count ==0){
            //self.openCol(i);
            $("#"+s+"").addClass('blank');
            this.cells[i].opened = true;
            //self.idArround(i);
            //console.log(""+self.idArround(i)+"");
            //self.turnArround(i);

            self.turnArroundNew(i);
                     
        }
    },

     openCol: function(i){
        var arrCol;
        arrCol = new Array();
            
         for(var j=0;j<=this.w-this.cells[i].y;j++){
                    var s1 = this.cells[i].y+j+"_"+this.cells[i].x;//向下遍历
                    arrCol.push(s1);
                    if($("#"+s1+"").text() != ""){
                    break;
                    }

                }
                for(var x=1;x<this.cells[i].y;x++){
                     var s2 = this.cells[i].y-x+"_"+this.cells[i].x;//向上遍历
                     arrCol.push(s2);
                     if($("#"+s2+"").text() != ""){
                        break;
                    }
                }console.log(arrCol);   
                for (var n = 0; n < arrCol.length; n++)
                {
                    $("#"+arrCol[n]+"").addClass('blank');
                }             


        },

        idArround: function(i){   //获取传入参数周围8个点的坐标                   
            var leftRow = 1;
            var rightRow = 1; 
            var leftCol = 1;
            var rightCol = 1;
            arrSecond = [];
            arrFirst = [];
            id = this.cells[i].y+"_"+this.cells[i].x;
            leftRow = this.cells[i].y - 1; if(leftRow < 1) leftRow= 1;
            rightRow = this.cells[i].y + 1;if(rightRow >= this.w) rightRow = this.w;
            leftCol = this.cells[i].x - 1; if(leftCol < 1) leftCol = 1;
            rightCol = this.cells[i].x + 1; if(rightCol >= this.h) rightCol = this.h;
            for(var m = leftRow; m <= rightRow; m++){
                for(var j = leftCol; j <= rightCol; j++){
                    var numId = m.toString() + "_" + j.toString();
                    var s = $("#"+numId+"").attr("name");
                    arrSecond.push(numId);
                    arrFirst.push(s);                                     
                }
            } return arrFirst;            
        },


    turnArround:function(e){
        var arrTested = new Array();
        
        for(var i=0; i<arrFirst.length;i++)
                {
                    if (this.cells[arrFirst[i]].count != 0 && this.cells[arrFirst[i]].opened == false && this.cells[arrFirst[i]].flag == false){
                        this.cells[arrFirst[i]].opened = true;
                        $("#"+arrSecond[i]+"").addClass('blank');
                        
                    } else
                    if(this.cells[arrFirst[i]].count == 0 && this.cells[arrFirst[i]].opened == false && this.cells[arrFirst[i]].flag == false){
                        arrTested.push(arrFirst[i]);
                        //console.log(arrTested);
                        $("#"+arrSecond[i]+"").addClass('blank');
                    }
                
                }  
    },

   turnArroundNew: function(i){
       self = Game;
       arrTest = new Array();
       arrTesting = new Array();
       arrTesting1 = new Array();
       arrTesting2 = new Array();
       
       arrTest = self.idArround(i);


       for(var n = 0; n < arrTest.length; n++){
           if(this.cells[arrTest[n]].count == 0 && this.cells[arrTest[n]].opened == false){
               id = this.cells[arrTest[n]].y+"_"+this.cells[arrTest[n]].x;
               $("#"+id+"").addClass('blank');
               arrTesting.push(arrTest[n]);
           }
           if(this.cells[arrTest[n]].count != 0 && this.cells[arrTest[n]].opened == false){
               id = this.cells[arrTest[n]].y+"_"+this.cells[arrTest[n]].x;
               $("#"+id+"").addClass('blank');
           }
       }

       arrTemp = new Array();
       arrTemp = [];
       for(var m = 0; m < arrTesting.length; m++){
            arrTemp[m] = self.idArround(arrTesting[m]);
            for(var h = 0; h < arrTemp[m].length; h++){
                if($.inArray(arrTemp[m][h],arrTest) < 0 && $.inArray(arrTemp[m][h],arrTesting) < 0 && $.inArray(arrTemp[m][h],arrTemp) < 0){
                arrTesting1.push(arrTemp[m][h]);    
                }
            }
       }
       


     






       //console.log('1',arrTest);
       console.log('2',arrTesting);
       //console.log('3',arrTemp);
       console.log('4',arrTesting1);
    



   },

      
    around: function() {
        
        $("td").addClass("hide");
        var leftRow = 1;
        var rightRow = 1; 
        var leftCol = 1;
        var rightCol = 1;
        var arrAround;
        arrAround = new Array();
        var arrNew = new Array();
        var arrMap = new Array();//新建一个数据用来存放循环后的数据
        var arrcountNum = new Array();
        var countNum = 0;//循环时用来存储数组中的某个元素出现的次数

        for (var n = 0; n < this.cells.length; n++) {
                    if(this.cells[n].mine == true){
                        id = this.cells[n].y+"_"+this.cells[n].x;
                        arrMap.push(id);
                    } 
            }

            for (var i = 0; i < arrMap.length; i++){
                var r = parseInt(arrMap[i].split("_")[0]);
                var c = parseInt(arrMap[i].split("_")[1]);
                leftRow = r - 1; if(leftRow < 1) leftRow= 1;
                rightRow = r + 1;if(rightRow >= this.w) rightRow = this.w;
                leftCol = c - 1; if(leftCol < 1) leftCol = 1;
                rightCol = c + 1; if(rightCol >= this.h) rightCol = this.h;
                for(var m = leftRow; m <= rightRow; m++){
                    for(var j = leftCol; j <= rightCol; j++){
                        var numId = m.toString() + "_" + j.toString();
                         if($.inArray(numId,arrMap) < 0){
                            arrAround.push(numId); 
                         }
                         
                    }
                } //console.log(arrAround);
            }              
            for(var w= 0; w<arrAround.length; w++){
                arrNew[w]=arrAround[w];
            }
            for(var p=0; p< arrNew.length; p++){
                if(arrNew[p]!=-1){
                    temp = arrNew[p];
                    for(var m=0; m< arrNew.length; m++){
                        if(temp == arrNew[m]){
                            countNum++;
                            arrNew[m]=-1;
                        }
                    }                
                    $("[id= "+arrAround[p]+"]").html(""+countNum+""); 
                    arrcountNum.push(countNum);
                    //console.log(arrcountNum);
                    countNum = 0;
                }
            }        
            for (i=0; i< this.cells.length; i++){
                s = this.cells[i].y+"_"+this.cells[i].x;
                //console.log(s);
                if (c = $("#"+s+"").text()> 0){
                    this.cells[i].count = parseInt($("#"+s+"").text());                 
                }
            }
    },
       

    cellClick: function(e) {
        var self = Game;
        var id = $(this).attr('name');//获取id

        if(self.cells[id].mine) {
            $(this).addClass('mine');          
            self.die();
            alert("gg");
        }else {
            
            self.around();
            self.open(id);
        }
    },
    cellRightClick: function(e) {
        var self = Game;
        var id = $(this).attr('id');
        var n = parseInt($(this).attr('name'));
        //console.log(n);
        //self.cells[id].flag = true;
        $(this).addClass('flag');
        //console.log(this.cells[5]);
        self.cells[n].flag = true;

        if(self.cells[n].flag == true && self.cells[n].mine == true){
            mineNum++;
        }
        
         if(mineNum == self.mine_count){
                alert("Win");
            }
        return false;
    },

    mouseOver: function(e){
        $("td").mouseover(function(){
            $(this).addClass("move");
        });
        $("td").mouseleave(function(){
            $(this).removeClass("move");
        });
    },

    start: function () {  //开始
        this.cells = new Array();
        var w = this.w, h = this.h;
        var num = -1;

        var bombs = new Array(w * h);//数组长度

        for (var x=1; x<=w; x++) {
            for (var y=1; y<=h; y++) {
                var i = (x-1)+(y-1)*h;//0-80
                bombs[i] = i;
                num++;
                //console.log(i);
                this.cells.push(Cell.createNew(y, x, num, false, 0));
               
                //console.log(this.cells); //显示类
            }
        } 
        

        var tds = this.table.find("td");
        for (var i = 0; i < this.cells.length; i++) {
            $(tds[i]).attr('id', this.cells[i].y+"_"+this.cells[i].x);
            $(tds[i]).attr('name', this.cells[i].num)
        }


        shuffle(bombs);
        for (var i=0; i<this.mine_count; i++) {
            //console.log('mine', bombs[i]);
            //console.log('mine', bombs[i]+1);
            this.cells[bombs[i]].mine = true;
        }

       
        // TODO: 计算 count, flag

        // TODO: interval 倒数
    },
};

$(document).ready(function() {
    Game.init($('#mines'));
});



