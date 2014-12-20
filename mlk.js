//used in http://メルクストーリア.gamewith.jp/
//生成人物json数据

var property_arr = [];
var card_base = [];
var card_detail = [];

var obj_prop = function(name, url){
  this.name = name;
  this.url = url;
};
var Charictor = function(prop, star, name, url, img, hp_max, atk_max, during, distance, atk_mount, atk_type){
  this.prop = prop;
  this.star = star;
  this.name = name;
  this.url = url;
  this.img = img;
  this.hp_max = hp_max;
  this.atk_max = atk_max;
  this.during = during;
  this.distance = distance;
  this.atk_mount = atk_mount;
  this.atk_type = atk_type;
  this.dps_one = ~~(atk_max/during);
  this.dps_many = ~~(atk_max*atk_mount/during);
};

$("h3").each(function(){
  if(this.innerHTML.match("属性別一覧")){
    $(this).next().find("a").each(function(){
      property_arr.push(new obj_prop(this.innerHTML, this.href.replace("メルクストーリア", "xn--cckza4aydug8bd3l")));
    });
  }
});

for(var i=0; i<property_arr.length; i++){
  (function(type_url){
    $.get(type_url, function(res){
      var $html = $(res);
      $html.find(".sorttable a").each(function(){
        var url = this.href.replace("メルクストーリア", "xn--cckza4aydug8bd3l");
        var name = this.innerHTML;
        var star = $(this).parent().next().html();
        get_detail_info(url, name, star);
      });
    });
  })(property_arr[i].url, property_arr[i].name);
}

//获取详细信息
function get_detail_info(url, name, star){
  $.get(url, function(res){
    var $html = $(res);
    var img = $html.find("#article-body img").attr("src");
    var hp_max, prop, atk_max, atk_mount, during, distance,atk_type;
    var hp_init, atk_init;
    var grow_type;
    //找到人物的h2
    var h2 = $html.find("h2"), selector_content;
    $html.find("h2").each(function(){
      var h2html = $(this).html();
      if(h2html && h2html.match("のステータス")){
        var star_t = h2html.match(/\d/);
        //可进化角色区别
        if(star_t && star_t.length){
          if(star == star_t[0]){
            h2 = $(this);
            img = h2.next().attr("src");
          }
        }
        else h2 = $(this);
      }
    });
    selector_content = h2.nextUntil("h2");
    if(selector_content.length == 0)
      selector_content = h2.nextUntil(".footer-wrap");
    //筛选
    selector_content.find("th").each(function(){
      if(this.innerHTML == "初期値"){
        hp_init = parseInt($(this).next().html().replace(/,|\./, ""));
        atk_init = parseInt($(this).next().next().html().replace(/,|\./, ""));
      }
      if(this.innerHTML == "覚醒MAX"){
        hp_max = parseInt($(this).next().html().replace(/,|\./, ""));
        atk_max = parseInt($(this).next().next().html().replace(/,|\./, ""));
        if(isNaN(hp_max)){
          //如果有直接计算好的数据就直接用
          //否则循环之后再手动计算
          hp_max = undefined;
          atk_max = undefined;
        }
      }
      else if(this.innerHTML == "属性")
        prop = $(this).parent().next().find("td").eq($(this).prevAll().length).html();
      else if(this.innerHTML == "同時攻撃数" || this.innerHTML == "同時攻撃")
        atk_mount = parseFloat($(this).parent().next().find("td").eq($(this).prevAll().length).html());
      else if(this.innerHTML == "武器種別")
        atk_type = $(this).parent().next().find("td").eq($(this).prevAll().length).html();
      else if(this.innerHTML == "リーチ")
        distance = parseFloat($(this).parent().next().find("td").eq($(this).prevAll().length).html());
      else if(this.innerHTML == "攻撃間隔" || this.innerHTML == "攻撃間")
        during = parseFloat($(this).parent().next().find("td").eq($(this).prevAll().length).html());
      else if(this.innerHTML == "成長タイプ")
        grow_type = parseFloat($(this).parent().next().find("td").eq($(this).prevAll().length).html());
    });
    //计算满觉数据
    if(!hp_max){
      var ty = grow_type == "早熟" ? 1:2;
      var ty = grow_type == "晚成" ? 3:2;
      var hp_max = hp_init*(1.8 + 0.1 * ty)+parseInt(hp_init*(0.8+0.1*ty)/(20+star*10-1))*75;
      var atk_max = atk_init*(1.8 + 0.1 * ty)+parseInt(atk_init*(0.8+0.1*ty)/(20+star*10-1))*75;
    }
    var charictor = new Charictor(prop, star, name, url, img, hp_max, atk_max, during, distance, atk_mount, atk_type);
    card_detail.push(charictor);
  });
}

//请求完成之后运行

// var _card_detail = [];
// for(var i=0; i<card_detail.length; i++)
// {
//   var flag = true;
//   for(var j=0; j<_card_detail.length; j++)
//     if(_card_detail[j].name === card_detail[i].name) flag = false;
//   flag && _card_detail.push(card_detail[i]);
// }
// card_detail = _card_detail;
// JSON.stringify(card_detail);