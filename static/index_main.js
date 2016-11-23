var Cell = {
    createNew: function(x, y, mine, count) {
        var c = {
            x: x,
            y: y,
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
    // var myArray = [1,2,3,4,5,6,7,8,9];
    // shuffle(myArray);

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
            $(this).attr('id', index);
        });

        // TODO: call in "start game" button click
        this.start();
    },
    die: function(){
        for(var i=0; i<this.cells.length; i++) {
            if (this.cells[i].mine) {
                $('td#' + i).addClass('mine');
            } else {
                if(this.cells[i].count)
                    $('td#' + i).text(this.cells[i].count);
                $('td#' + i).addClass('count');
            }
        }
    },
    open: function(i){
        console.log('open', i, this.cells[i]);
        if (this.cells[i].mine || this.cells[i].opened)
            return;
        else if (!this.cells[i].flag) {
            $('td#' + i).text(this.cells[i].count);
            $('td#' + i).addClass('count');
            this.cells[i].opened = true;
        }
        var around = this.around(i);
        console.log('around', around);
        // return;
        var len = around.length;
        for (var j= 0; j< len; j++) {
            this.open(around[j]);
        }
    },
    around: function(i) {
        var self = this;
        function incell(i) {
            return i>=0 && i<self.w * self.h;
        }
        return [i-self.w, i-1, i+1, i+self.w].filter(incell);
    },
    cellClick: function(e) {
        var self = Game;
        var id = $(this).attr('id');
        console.log($(this).attr('id'));
        if(self.cells[id].mine) {
            $(this).addClass('mine');
            self.die();
        }else {
            $(this).addClass('count');
            self.open(id);
        }
    },
    cellRightClick: function(e) {
        var self = Game;
        var id = $(this).attr('id');
        self.cells[id].flag = true;
        $(this).addClass('flag');
        return false;
    },
    start: function () {
        this.cells = new Array();
        var w = this.w, h = this.h;

        var bombs = new Array(w * h);

        for (var x=0; x<w; x++) {
            for (var y=0; y<h; y++) {
                var i = x+y*h;
                bombs[i] = i;
                this.cells.push(Cell.createNew(x, y, false, 0))
            }
        }
        shuffle(bombs);
        for (var i=0; i<this.mine_count; i++) {
            console.log('mine', bombs[i]);
            this.cells[bombs[i]].mine = true;
        }

        // TODO: 计算 count, flag

        // TODO: interval 倒数
    },
};

$(document).ready(function() {
    Game.init($('#mines'));
});



var rows = 9;//9行
var cols = 9;//9列
var bombNumber = 10;//雷数量
var pub_randomId;

pub_repeadBomId = new Array();
arrBomb = new Array();
arrtableId = new Array();


$(document).ready(function() {
    return;
creatId();
creatBomb();
getArroundId(); 
mouse();
})




//获取随机数
function RandomNum(){
    var randomId = parseInt(Math.random()*rows+1).toString() + "_" + parseInt(Math.random()*cols+1).toString();
    //坐标不能重复，查询数组中是否存在相同的坐标
    if($.inArray(randomId,arrBomb) >= 0){
        RandomNum();}//>=0
    else{
        arrBomb.push(randomId);
        pub_randomId = randomId;
    }   
}

//根据随机数获取雷的坐标
function RandomBomb(){
    for (var i=0;i<bombNumber;i++){
        RandomNum();
    }    
}

//为每个单元格附上坐标
function creatId(){  
    for(var r = 1; r<= rows; r++){
        for(var c = 1; c<= cols; c++){
            var id = r.toString() + "_" + c.toString();
            arrtableId.push(id);
        }
    }
    for (var i = 0; i< 81; i++){          
        $("tr td:eq(" + i + ")").attr("id",""+ arrtableId[i] +"");  
        $("tr td:eq(" + i + ")").attr("class","Bomb"); 
    }
}

//显示雷
function creatBomb() {
    RandomBomb();
    //console.log(arrBomb);
    for(i = 0; i<= arrBomb.length; i++)
    {
        if($.inArray(arrBomb[i],arrtableId) >=0 ){    
        $("#"+arrBomb[i]+"").html("雷");
        //console.log(1);
        }
    }
    
}

//显示雷周围坐标
function getArroundId() {
    var leftRow = 1;
    var rightRow = 1; 
    var leftCol = 1;
    var rightCol = 1;
    var numIdarry = new Array();
    var arrNew = new Array();
    var arrMap = new Array();//新建一个数据用来存放循环后的数据
    var arrcountNum = new Array();
    var countNum = 0;//循环时用来存储数组中的某个元素出现的次数
    
    for(var n = 0; n < arrBomb.length; n++){

        var r = parseInt(arrBomb[n].split("_")[0]);
        var c = parseInt(arrBomb[n].split("_")[1]);
        //console.log(r,c);
        
        leftRow = r - 1; if(leftRow < 1) leftRow= 1;
        rightRow = r + 1;if(rightRow >= rows) rightRow = rows;
        leftCol = c - 1; if(leftCol < 1) leftCol = 1;
        rightCol = c + 1; if(rightCol >= cols) rightCol = cols;
        
        for(var i = leftRow; i <= rightRow; i++){
            for(var j = leftCol; j <= rightCol; j++){
                var numId = i.toString() + "_" + j.toString();
                if($.inArray(numId,arrBomb) < 0){
                    numIdarry.push(numId);                       
                }                   
            }
        }
    }
    //console.log(numIdarry);
    for(var w= 0; w<numIdarry.length; w++){
        arrNew[w]=numIdarry[w];
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
            arrMap.push(temp);
            $("#"+numIdarry[p]+"").html(countNum); 
            arrcountNum.push(countNum);
            countNum = 0;
        }
    }
    //console.log(arrcountNum);                     
}
       
       
//鼠标事件
function mouse(){

$("table").addClass("DefaultTable");
//鼠标移动
$("td").mouseover(function(){
        $(this).addClass("move");
    });
$("td").mouseleave(function(){
        $(this).removeClass("move");
    });

}       
     


