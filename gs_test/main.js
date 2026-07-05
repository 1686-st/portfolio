const newsSheelUrl =
  "https://docs.google.com/spreadsheets/d/18Xjbji7idrD-JtV8cCicn0GVsVhYEAiFSotFel2P49E/gviz/tq?tqx=out:csv";

// XMLHttpRequestでjsonデータを読み込み
let requestURL =
  "https://docs.google.com/spreadsheets/d/18Xjbji7idrD-JtV8cCicn0GVsVhYEAiFSotFel2P49E/gviz/tq?tqx=out:csv";
let request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();

// JavaScriptオブジェクトに変換
request.onload = function () {
  let data = request.response;
  data = JSON.parse(JSON.stringify(data));
  dataArray(data);
};

// HTMLに出力
function dataArray(els) {
  let array = document.querySelector(".array");
  els.forEach((el) => {
    let filename = el.filename;
    let name = el.name;
    let gender = el.gender;
    let occupation = el.occupation;
    let direction = el.skill.direction;
    let cording = el.skill.cording;
    let design = el.skill.design;
    let code =
      '<ul class="list">' +
      '<img src="' +
      filename +
      '">' +
      '<li class="listItem">名前：' +
      name +
      "</li>" +
      '<li class="listItem">性別：' +
      gender +
      "</li>" +
      '<li class="listItem">職種：' +
      occupation +
      "</li>" +
      '<ul class="list-skill">' +
      '<p class="skill">＜スキル＞' +
      '<li class="listItem-skill">ディレクション：' +
      direction +
      "</li>" +
      '<li class="listItem-skill">コーディング：' +
      cording +
      "</li>" +
      '<li class="listItem-skill">デザイン：' +
      design +
      "</li>" +
      "</ul>";

    ("</ul>");
    array.insertAdjacentHTML("beforeend", code);
  });
}
