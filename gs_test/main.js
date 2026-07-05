const newsSheelUrl =
  "https://docs.google.com/spreadsheets/d/18Xjbji7idrD-JtV8cCicn0GVsVhYEAiFSotFel2P49E/gviz/tq?tqx=out:csv";

const parseCsv = (csvString) => {
  const rows = csvString.split("\n");
  return rows.map((row) => {
    const [date, content, test1, test2, test3] = row
      .split(",")
      .map((col) => col.slice(1, -1));
    return { date, content, test1, test2, test3 };
  });
};

(async () => {
  const newsTableBody = document.getElementById("newsTableBody");
  const response = await fetch(newsSheelUrl);
  const content = await response.text();

  parseCsv(content)
    .reverse()
    .forEach(({ date, content, test1, test2, test3 }) => {
      const tableRow = document.createElement("tr");
      const dateCell = document.createElement("td");
      dateCell.textContent = date;
      const contentCell = document.createElement("td");
      contentCell.textContent = content;
      contentCell.textContent = test1;
      contentCell.textContent = test2;
      contentCell.textContent = test3;
      tableRow.appendChild(dateCell);
      tableRow.appendChild(contentCell);
      newsTableBody.appendChild(tableRow);
    });
})();
