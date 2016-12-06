var arrTesting = new Array();
var arrBlank = new Array();

var Cell = {
    createNew: function(num, mine, count) {
        var c = {
            num: num,
            flag: false,    
            count: count,    
            mine: mine,      
            opened: false,
            toClassName: function() {
                if (this.mine){
                    return "mine";
                }   
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

function sortNumber(a,b){
    return a - b;
}


var Game = {
    table: null,
    cells: null,
    mine_count: 9,
    time_count: 0,
    w: 9,
    h: 9,
    timeID: 0,
    
    
    init: function (e) {
        this.table = e;
        var self = this;  
        Game.timeID = setInterval("Game.timeCount()",1000), 
        $("#startbutton").val("重置");
        $("#startbutton").attr("id","resetbutton");
        
        this.table.find("td").each(function (index, e){
            $(this).bind('click', self.cellClick);
            $(this).bind('contextmenu', self.cellRightClick);
            $(this).bind('mouseover',self.mouseOver);
        });       
        this.start();
        this.around();
    },

    die: function(){
        for(var i = 0; i < this.cells.length; i++) {
            if (this.cells[i].mine) {
                $("[name= "+i+"]").addClass("mine");
            }
        }
    },
    
    open: function(i){
        self = this;
        if(this.cells[i].count != 0 && this.cells[i].opened == false){
            $("[name= "+i+"]").addClass("blank");
            $("[name= "+i+"]").find("span").addClass("count");
            this.cells[i].opened = true;
        }
        else
        if(this.cells[i].count == 0){
            $("[name= "+i+"]").addClass("blank");
            this.cells[i].opened = true;          
            self.turnArround(i);
        }
    },

    idRound : function(i){
        var self = this;
        var i = parseInt(i);
        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();

        arr1 = [];
        arr2 = [];
        arr3 = [];

        if(i % this.w == 0){
            
            arr1 = [ 
                i,
                i-this.w,
                i-this.w+1,
                i+1,
                i+this.w,
                i+this.w+1
                ].filter(function(x){return x>=0 && x < self.w * self.h}).sort(sortNumber);
                arr1 = arr1.map(function (val) { return val.toString();})
                return arr1;
        }else 
        if(i % this.w == this.w - 1){
            arr2 = [
                i,
                i-this.w-1,
                i-this.w,i-1,
                i+this.w-1,
                i+this.w,
                ].filter(function(x){return x>=0 && x < self.w * self.h}).sort(sortNumber);
                arr2 = arr2.map(function (val) { return val.toString();})
                return arr2;

        }else{
            arr3 = [
                i,
                i-1, // left
                i+1, // right
                i-self.w, // up 
                i+self.w, // down
                i-self.w+1, // up right
                i-self.w-1, // up left
                i+self.w-1, // down left
                i+self.w+1 // down right
                ].filter(function(x){return x>=0 && x < self.w * self.h}).sort(sortNumber);
                arr3 = arr3.map(function (val) { return val.toString();})
                return arr3;
        }

    },
       

    turnArround: function(i){
       self = Game;

       if (arrTesting.length > 0) {
        arrTesting.splice(0, 1);
       }
       
       var currentBlank = self.idRound(i);

       for(var j = 0; j < currentBlank.length; j++) {
           if ($.inArray(currentBlank[j], arrBlank) < 0){
               arrBlank.push(currentBlank[j]);
           }
       }

       for(var n = 0; n < currentBlank.length; n++){
           if(this.cells[currentBlank[n]].count == 0 && this.cells[currentBlank[n]].opened == false){
               $("[name= "+currentBlank[n]+"]").addClass('blank');
               $("[name= "+currentBlank[n]+"]").find("span").addClass("count");
               this.cells[currentBlank[n]].opened = true;
               arrTesting.push(currentBlank[n]);
           }
           if(this.cells[currentBlank[n]].count != 0 && this.cells[currentBlank[n]].opened == false){
               $("[name= "+currentBlank[n]+"]").addClass('blank');
               $("[name= "+currentBlank[n]+"]").find("span").addClass("count");
               this.cells[currentBlank[n]].opened = true;
           }
       }

       if (arrTesting.length > 0) {
           self.turnArround(arrTesting[0]);
       }
   },

    around: function() {
        self = Game;
        var arrAround;
        var arrNew;
        var arrBombMap;
        var arrcountNum;
        var countNum = 0;
        arrAround = new Array();
        arrNew = new Array();
        arrBombMap = new Array();
        arrcountNum = new Array();

        for (var n = 0; n < this.cells.length; n++) {
            if(this.cells[n].mine == true){
                arrBombMap.push(n);
            } 
        }

        for (var i = 0; i < arrBombMap.length; i++){   
            arrAround = arrAround.concat(self.idRound(arrBombMap[i]));                              
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
                    $("[name= "+arrAround[p]+"]").html("<span>"+countNum+"</span>"); 
                    arrcountNum.push(countNum);
                    countNum = 0;
            }
        }       
         
        for (i=0; i< this.cells.length; i++){
            
            if (c = $("[name= "+i+"]").text()> 0){
                this.cells[i].count = parseInt($("[name= "+i+"]").text());                 
            }
        }

        $("td span").addClass("cover");
    },


    cellClick: function(e) {
        var self = Game;
        var id = $(this).attr('name');

        if(self.cells[id].mine) {
            $(this).addClass('mine');          
            self.die();
            self.mine_count = 0;
            clearInterval(self.timeID);
            $("#gameTitle").replaceWith("<legend id =gameTitle >你输了</legend>");  
            
        }else{
            self.open(id);
        }
    },

    cellRightClick: function(e) {
        var self = Game;
        var id = $(this).attr('id');
        var n = parseInt($(this).attr('name'));
        
        switch (self.cells[n].flag){
            case false: {
                $(this).addClass('flag');
                self.cells[n].flag = true;
            } 
            break;
            case true: {
                $(this).removeClass('flag');
                self.cells[n].flag = false;
            } 
            break;
        }

        if(self.cells[n].flag == true && self.cells[n].mine == true && self.cells[n].opened == false){
            self.cells[n].opened = true;
            self.mine_count --;
            
        }
        
         if(self.mine_count == 0 && self.win() == true){
            $("#gameTitle").replaceWith("<legend id =gameTitle>你赢了</legend>");  
            clearInterval(self.timeID);
        }
        return false;
    },

    
    win: function () { 
        for (var i = 0; i < this.cells.length; i++){
            if (this.cells[i].opened == true){
                return true;
            }
            return false;
        }
     },


    mouseOver: function(e){
        $("td").mouseover(function(){
            $(this).addClass("move");
        });
        $("td").mouseleave(function(){
            $(this).removeClass("move");
        });
    },

    start: function () {  
        this.cells = new Array();
        var w = this.w, h = this.h;
        var num = -1;
        var bombs = new Array(w * h);

        for (var x=1; x<=w; x++) {
            for (var y=1; y<=h; y++) {
                var i = (x-1)+(y-1)*h;
                bombs[i] = i;
                num++;
                this.cells.push(Cell.createNew(num, false, 0));           
               // console.log(this.cells); //显示类
            }
        } 
        

        var tds = this.table.find("td");
        for (var i = 0; i < this.cells.length; i++) {
            $(tds[i]).attr('name', this.cells[i].num)
        }


        shuffle(bombs);
        for (var i=0; i<this.mine_count; i++) {
            this.cells[bombs[i]].mine = true;
        }
    },


    gameReSet: function(){

        $("td").removeClass("blank");
        $("td").removeClass("flag");
        $("td").removeClass("mine");
        $("td span").removeClass("count");
        $("td span").remove(); 
        Game.table = null;
        Game.cells = null;
        Game.mine_count = 9;
        Game.time_count = 0;
        arrTesting = [];
        arrBlank = [];
        Game.timeID = 0;      
        $("#gameTitle").replaceWith("<legend id =gameTitle>扫雷</legend>");  

        Game.init($('#mines'));
       
    },

    timeCount: function () {
        document.getElementById("timetxt").value = this.time_count;
        this.time_count ++;
    },
};
//end


$(document).ready(function() {
    $("#startbutton").click(function(){ 
        Game.init($('#mines'));   
        $("#resetbutton").click(function(){ 
            Game.gameReSet();
        })
    })
});



