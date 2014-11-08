var mlk_table = {
  datas:[],
  init: function(){
    if(!this.datas.length){
      $.getJSON("mlk.json", function(datas){
        mlk_table.datas = datas;
        mlk_table.build(mlk_table.datas);
      });
    }
  },
  build: function(datas){
    this.clear();
    var mlk_list = $(".mlk_list");
    var f_star = $("#star").val();
    var f_prop = $("#prop").val();
    var f_atk_type = $("#atk_type").val();
    var is_distance = $("#c_distance").is (":checked");
    for(var i=0; i<datas.length; i++){
      var data = datas[i];
      if(!this.filter(data, f_star, f_prop, f_atk_type, is_distance))
        continue;
      var tr = 
      "<tr>"
        + "<td align='center'><img width='50' data-original='" + data.img +"'/></td>"
        + "<td><a href="+ data.url +" >" + data.name +"</a></td>"
        + "<td>" + data.star +"</td>"
        + "<td>" + data.prop +"</td>"
        + "<td>" + data.atk_type +"</td>"
        + "<td>" + data.hp_max +"</td>"
        + "<td>" + data.atk_max +"</td>"
        + "<td>" + data.dps_one +"</td>"
        + "<td>" + data.dps_many +"</td>"
        + "<td>" + data.distance +"</td>"
        + "<td>" + data.atk_mount +"</td>"
      "</tr>";
      mlk_list.append(tr);
    }
    //lazyload
    $("img").lazyload();
  },
  filter: function(data, star, prop, atk_type, is_distance){
    if(star != 0 && data.star != star) return false;
    if(prop != 0 && data.prop != prop) return false;
    if(atk_type != 0 && data.atk_type != atk_type) return false;
    if(is_distance && data.distance <= 155) return false;
    return true;
  },
  clear: function(){
    $("tr:not(.tr_firm)").remove();
  }
};

mlk_table.init();

$(".tr_filter select, .tr_filter input").change(function(){
  mlk_table.build(mlk_table.datas);
});

//排序
$(".tr_title th").click(function(){
  var value = $(this).attr("value");
  var datas = mlk_table.datas.sort(function(a, b){
    var v1 = eval("a."+value);
    var v2 = eval("b."+value);
    if(v1 > v2) return false;
    return true;
  });
  mlk_table.build(datas);
});

