const newsSheelUrl =
  "https://docs.google.com/spreadsheets/d/18Xjbji7idrD-JtV8cCicn0GVsVhYEAiFSotFel2P49E/gviz/tq?tqx=out:csv";
const parseCsv = (csvString) => {
  const rows = csvString.split("\n");
  return rows.map((row) => {
    const [date, content] = row.split(",").map((col) => col.slice(1, -1));
    return { date, content, content2, content3 };
  });
};

(async () => {
  const newsTableBody = document.getElementById("newsTableBody");
  const response = await fetch(newsSheelUrl);
  const content = await response.text();

  parseCsv(content)
    .reverse()
    .forEach(({ date, content, content2, content3 }) => {
      const tableRow = document.createElement("tr");
      const dateCell = document.createElement("td");
      dateCell.textContent = date;
      const contentCell = document.createElement("td");
      contentCell.textContent = content;
      const contentCell = document.createElement("td");
      contentCell.textContent = content2;
      const contentCell = document.createElement("td");
      contentCell.textContent = content3;
      tableRow.appendChild(dateCell);
      tableRow.appendChild(contentCell);
      newsTableBody.appendChild(tableRow);
    });
})();
