const Excel = require("exceljs");
const moment = require("moment");

const CreateReportDev = async (name, sunday, results) => {
  const workbook = new Excel.Workbook();

  const urlIn = "./public/Format_Dev.xlsx";
  const urlOut = "./public/output/";
  // console.log(results);

  await workbook.xlsx.readFile(urlIn);

  if (results.length > 0) {
    // Daily History
    const worksheet1 = workbook.getWorksheet("Daily_History");

    for (let i = 2; i <= results.length + 1; i++) {
      const row = worksheet1.getRow(i);

      for (let j = 1; j <= 16; j++) {
        row.getCell(j).value = isNaN(Object.values(results[i - 2])[j - 1])
          ? Object.values(results[i - 2])[j - 1]
          : Number(Object.values(results[i - 2])[j - 1]);
      }

      row.commit();
    }

    // Format Dev
    const worksheet2 = workbook.getWorksheet("Format_Dev");

    const row2 = worksheet2.getRow(5);

    row2.getCell(3).value = name;
    row2.getCell(7).value = Number(sunday.slice(0, 4));
    row2.getCell(8).value = Number(sunday.slice(4, 6));
    row2.getCell(9).value =
      moment(sunday, "YYYYMMDD").week() -
      moment(sunday, "YYYYMMDD")
        .startOf("month")
        .week() +
      1;
    row2.getCell(10).value = Number(sunday.slice(6, 8));
    row2.getCell(11).value = Number(
      moment(sunday, "YYYYMMDD")
        .add(6, "days")
        .format("YYYYMMDD")
        .toString()
        .slice(6, 8)
    );
    row2.commit();

    if (results.length > 1) {
      worksheet2.duplicateRow(8, results.length - 1, true);
    }

    const resultsHr = results.map((obj, idx) => {
      obj.worktime = obj.worktime / 60;
      return obj;
    });

    for (let i = 8; i <= resultsHr.length + 7; i++) {
      const _row2 = worksheet2.getRow(i);
      _row2.height = 40;

      for (let j = 2; j <= 8; j++) {
        _row2.getCell(j).value = isNaN(
          Object.values(resultsHr[i - 8]).slice(1, 8)[j - 2]
        )
          ? Object.values(resultsHr[i - 8]).slice(1, 8)[j - 2]
          : Number(Object.values(resultsHr[i - 8]).slice(1, 8)[j - 2]);
      }

      _row2.commit();
      worksheet2.mergeCells(`H${i}:K${i}`);
      worksheet2.getCell(`K${i}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" }
      };
    }

    worksheet2.getRow(resultsHr.length + 8).getCell(7).value = {
      formula: `=SUM(G${8}:G${resultsHr.length + 7})`,
      result: resultsHr.map(obj => obj.worktime).reduce((sum, i) => sum + i)
    };

    worksheet2.mergeCells(`B${resultsHr.length + 8}:F${resultsHr.length + 8}`);
    worksheet2.getCell(`F${resultsHr.length + 8}`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" }
    };

    worksheet2.mergeCells(`H${resultsHr.length + 8}:K${resultsHr.length + 8}`);
    worksheet2.getCell(`K${resultsHr.length + 8}`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" }
    };

    for (let i = 1; i < 13; i++) {
      worksheet2.getColumn(i).eachCell(cell => {
        if (cell.value === null) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF" }
          };
        }
      });
    }

    for (let i = 1; i < 13; i++) {
      worksheet2.getRow(resultsHr.length + 9).getCell(i).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF" }
      };
    }
  }

  await workbook.xlsx.writeFile(
    `${urlOut}${sunday}_${moment(sunday, "YYYYMMDD")
      .add(6, "days")
      .format("YYYYMMDD")
      .toString()}_${name}.xlsx`
  );
};

module.exports = CreateReportDev;
