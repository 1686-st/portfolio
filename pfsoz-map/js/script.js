// Loading ------------------------------------------------------------------------------------------------
$("#loading")
  .delay(1500)
  .queue(function () {
    $(this).addClass("loaded").dequeue();
  });

// Dialog ------------------------------------------------------------------------------------------------
$(".button-dialog").on("click", function () {
  $("#dialog").slideToggle("fast");
});

// MAP ------------------------------------------------------------------------------------------------------
var map = L.map("map", {
  tap: false,
  crs: L.CRS.Simple,
});

map.setView(L.latLng(-100, 128), 1);
//スクロール範囲の指定、地図ぴったりだとポップアップが見づらい（左上:右下）
//map.setMaxBounds(new L.LatLngBounds([1000, -1000], [-1400, 1400]));
L.tileLayer("tiles/{z}_{x}_{y}.gif", {
  minNativeZoom: 1,
  minZoom: 1,
  maxNativeZoom: 4, //4
  maxZoom: 8, //+2
  attribution:
    'Map created by <a href="https://www.pixiv.net/users/19606">arohaJ</a> for <a href="https://www.pixiv.net/artworks/101965643">"PFSOZ"</a> project.',
  //タイルの表示範囲指定（左上:右下）
  bounds: [
    [0, 0],
    [-190, 256],
  ],
}).addTo(map);

//隙間埋め用に裏に低画質地図画像配置------------------------------------------------------------------------------------------------------
map.createPane("gap-fill");
L.imageOverlay(
  "https://1686.site/pfsoz-map/tiles/0_0_0.gif",
  //左上latlong、右下latlong
  L.latLngBounds([0, 0], [-256, 256]),
  { pane: "gap-fill", opacity: 1 }
).addTo(map);

//天気アニメ------------------------------------------------------------------------------------------------------
map.createPane("whether-rain");
L.imageOverlay(
  "https://1686.site/pfsoz-map/images/wz-rain.png",
  //左上latlong、右下latlong
  L.latLngBounds([-99, 56], [-111, 72]),
  { pane: "whether-rain", opacity: 0.7 }
).addTo(map);
map.createPane("whether-snow");
L.imageOverlay(
  "https://1686.site/pfsoz-map/images/wz-snow.png",
  L.latLngBounds([-8, 72], [-18, 92]),
  { pane: "whether-snow", opacity: 0.5 }
).addTo(map);
map.createPane("whether-oasis");
L.imageOverlay(
  "https://1686.site/pfsoz-map/images/wz-oasis.png",
  L.latLngBounds([-155, 201], [-159, 207]),
  { pane: "whether-oasis", opacity: 0.7 }
).addTo(map);

// Filter Button type multi------------------------------------------------------------------------------------------------------
var belongFilterButton = L.control
  .tagFilterButton({
    data: [
      "red",
      "blue",
      "purple",
      "white",
      "yellow",
      "green",
      "black",
      "gray",
    ],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-flag"></i>',
    clearText: "所属：取り消す",
  })
  .addTo(map);

var typeFilterButton = L.control
  .tagFilterButton({
    data: [
      "campground",
      "store",
      "utensils",
      "seedling",
      "dragon",
      "image",
      "exclamation-circle",
    ],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-tags"></i>',
    clearText: "種類：取り消す",
  })
  .addTo(map);

typeFilterButton.addToReleated(belongFilterButton);

jQuery(".easy-button-button").click(function () {
  target = jQuery(".easy-button-button").not(this);
  target.parent().find(".tag-filter-tags-container").css({
    display: "none",
  });
});

// Home button ------------------------------------------------------------------------------------------------------
L.easyButton(
  "fas fa-map",
  function (btn, easyMap) {
    easyMap.setView(L.latLng(-100, 128), 1);
  },
  "初期位置に戻す"
).addTo(map);

// Marker Pin------------------------------------------------------------------------------------------------------
var dragPin = L.icon({
  iconUrl: "images/marker-pin.svg",
  iconRetinaUrl: "images/marker-pin.svg",
  iconSize: [40, 50],
  iconAnchor: [20, 49],
  popupAnchor: [0, -40],
});
var pointer = L.marker(L.latLng(0, 0), {
  draggable: true,
  icon: dragPin,
})
  .on("drag", function (e) {
    update_coord_references(map, pointer, e.latlng);
  })
  .addTo(map)
  .bindPopup();
function digit_format(num) {
  return ("    " + num.toFixed(2)).substr(-8);
}
function update_coord_references(map, marker, latLng) {
  var p = map.project(latLng, map.getZoom());
  var pMax = map.project(latLng, 2);
  var content =
    '<pre class="coords">' +
    "latitude:" +
    digit_format(latLng.lat) +
    "\n" +
    "longitude:" +
    digit_format(latLng.lng) +
    "</pre>";
  marker.getPopup().setContent(content).openOn(map);
}

//URLhash------------------------------------------------------------------------------------------------------
var hash = new L.Hash(map);

// Read markers data from data.csv------------------------------------------------------------------------------------------------------
$.get(
  "https://1686-st.github.io/portfolio/pfsoz-map/marker.csv",
  function (csvString) {
    var data = Papa.parse(csvString, {
      header: true,
    }).data;
    for (var i in data) {
      var row = data[i];
      var marker = L.marker([row.latitude, row.longitude], {
        title: row.belongs + "_marker " + row.markerlimitend,
        icon: L.icon.glyph({
          prefix: "fa",
          glyph: row.type,
        }),
        tags: [row.type, row.belongs],
      }).bindPopup(
        '<h2 class="' +
          row.belongs +
          '">' +
          row.markertitle +
          '</h2><a class="pop-guildtags" href="https://www.pixiv.net/tags/' +
          row.markertag +
          '/artworks" target="_blank" rel="noopener noreferrer">' +
          row.markertag +
          '</a><a class="pop-pagelink" href="' +
          row.markerurl +
          '" target="_blank" rel="noopener noreferrer">Pixiv</a><p class="pop-tag-' +
          row.type +
          '"></p><a class="share-ban-twi" href="https://twitter.com/share?url=https://1686.site/pfsoz-map/%238/' +
          row.latitude +
          "/" +
          row.longitude +
          "&text=" +
          row.markertitle +
          "｜座標: %238/" +
          row.latitude +
          "/" +
          row.longitude +
          '" rel="nofollow noopener noreferrer" target="_blank"><i class="fab fa-twitter"></i> 位置を共有</a><div class="tbc-' +
          row.tbc +
          '"></div>'
      );
      marker.addTo(map);
    }
  }
);

//minimap------------------------------------------------------------------------------------------------------
var minimapUrl = "tiles/{z}_{x}_{y}.gif";
var minimapAttrib =
  'Map created by <a href="https://www.pixiv.net/users/19606">arohaJ</a> for <a href="https://www.pixiv.net/artworks/100516274">"PF"</a> project.';
var miniMapSetting = new L.TileLayer(minimapUrl, {
  minZoom: 0,
  maxZoom: 2,
  attribution: minimapAttrib,
  bounds: [
    [0, 0],
    [-190, 256],
  ],
});
var miniMap = new L.Control.MiniMap(miniMapSetting, {
  zoomLevelFixed: 0,
  height: 180,
  width: 260,
  toggleDisplay: true,
  collapsedWidth: 20,
  collapsedHeight: 20,
  //minimized: true
}).addTo(map);

/*
//章用------------------------------------------------------------------------------------------------------
var LandmarkIcon = L.Icon.extend({
    options: {
        iconSize:     [52, 66],
        iconAnchor:   [26, 66],
        popupAnchor:  [0, -34]
    }
});
var firstNewcityIcon = new LandmarkIcon({iconUrl: 'images/rm-c-firstNewcityIcon.svg?20221214'});
var mRed = L.marker([-78.36, 73.22], {icon: firstNewcityIcon}).bindPopup('<h2 class="event">最終章：ゼラルディアの王笏</h2><a class="pop-guildtags" href="https://www.pixiv.net/tags/欺瞞の悪魔/artworks" target="_blank" rel="noopener noreferrer">欺瞞の悪魔</a><a class="pop-pagelink" href="https://www.pixiv.net/artworks/103584939" target="_blank" rel="noopener noreferrer">Pixiv</a>').addTo(map);

var firstTreasureIcon = new LandmarkIcon({iconUrl: 'images/rm-c-firstGoldIcon.svg?20221214'});
var mBlue = L.marker([-80.94, 69.00], {icon: firstTreasureIcon}).bindPopup('<h2 class="event">最終章：ゼラルディアの王笏</h2><a class="pop-guildtags" href="https://www.pixiv.net/tags/死霊術師の饗宴/artworks" target="_blank" rel="noopener noreferrer">死霊術師の饗宴</a><a class="pop-pagelink" href="https://www.pixiv.net/artworks/103584939" target="_blank" rel="noopener noreferrer">Pixiv</a>').addTo(map);

var firstGoldIcon = new LandmarkIcon({iconUrl: 'images/rm-c-firstTreasureIcon.svg?20221214'});
var mPurple = L.marker([-80.94, 77.00], {icon: firstGoldIcon}).bindPopup('<h2 class="event">最終章：ゼラルディアの王笏</h2><a class="pop-guildtags" href="https://www.pixiv.net/tags/黒王軍の進撃/artworks" target="_blank" rel="noopener noreferrer">黒王軍の進撃</a><a class="pop-pagelink" href="https://www.pixiv.net/artworks/103584939" target="_blank" rel="noopener noreferrer">Pixiv</a>').addTo(map);
*/
