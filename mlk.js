//used in http://メルクストーリア.gamewith.jp/
//生成人物json数据

var weapon_type = [];
var card_base = [];
var card_detail = [];

var WeaponType = function(name, url){
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
  if(this.innerHTML.match("武器種別一覧")){
    $(this).next().find("a").each(function(){
      weapon_type.push(new WeaponType(this.innerHTML, this.href.replace("メルクストーリア", "xn--cckza4aydug8bd3l")));
    });
  }
});

for(var i=0; i<weapon_type.length; i++){
  (function(type_url, type_name){
    $.get(type_url, function(res){
      var $html = $(res);
      $html.find(".sorttable a").each(function(){
        var url = this.href.replace("メルクストーリア", "xn--cckza4aydug8bd3l");
        var name = this.innerHTML;
        var star = $(this).parent().next().html();
        get_detail_info(url, type_name, name, star);
      });
    });
  })(weapon_type[i].url, weapon_type[i].name);
}

//获取详细信息
function get_detail_info(url, atk_type, name, star){
  $.get(url, function(res){
    var $html = $(res);
    var img = $html.find("#article-body img").attr("src");
    var hp_max, prop, atk_max, atk_mount, during, distance;
    $html.find("th").each(function(){
      if(this.innerHTML == "覚醒MAX"){
        if(!hp_max) hp_max = parseInt($(this).next().html().replace(/,|\./, ""));
        if(!atk_max) atk_max = parseInt($(this).next().next().html().replace(/,|\./, ""));
      }
      else if(this.innerHTML == "属性"){
        if(!prop) prop = $(this).parent().next().find("td").eq(1).html();
      }
      else if(this.innerHTML == "同時攻撃数"){
        if(!atk_mount) atk_mount = parseFloat($(this).parent().next().find("td").eq(0).html());
      }
      else if(this.innerHTML == "リーチ"){
        if(!distance) distance = parseFloat($(this).parent().next().find("td").eq(2).html());
      }
      else if(this.innerHTML == "攻撃間隔"){
        if(!during) during = parseFloat($(this).parent().next().find("td").eq(1).html());
      }
    });
    var charictor = new Charictor(prop, star, name, url, img, hp_max, atk_max, during, distance, atk_mount, atk_type);
    card_detail.push(charictor);
  });
}