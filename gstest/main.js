Papa.parse(
  "https://docs.google.com/spreadsheets/d/17aAJv0fEf866iE9xs6C2Ngc_TOVwO9pfBLQ8eCY77Dg/gviz/tq?tqx=out:csv",
  {
    download: true,
    delimiter: ",",
    header: false,
    complete: function (results) {
      parsedData = results.data;
      //行の繰り返し処理
      for (var i = 0; i < parsedData.length; i++) {
        var row = parsedData[i];
        var html = "<tr>";
        //列の繰り返し処理
        for (var j = 0; j < row.length; j++) {
          var value = row[j];
          //1行目は見出しとして扱う 適宜調整してください
          if (i == 0) {
            html += "<th><span>" + value + "</span></th>";
          } else {
            html += "<td><span>" + value + "</span></td>";
          }
        }
        html += "</tr>";
        //trごとにテーブルタグに挿入
        $("#newsTableBody").append(html);
      }
    },
  },
);
