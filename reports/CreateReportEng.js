const Excel = require("exceljs");
const moment = require("moment");

const CreateReportEng = async (name, sunday, results) => {
  const workbook = new Excel.Workbook();

  const urlIn = "./public/Format_Eng.xlsx";
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

    const resultsHr = results.map((obj, idx) => {
      obj.worktime = obj.worktime / 60;
      return obj;
    });

    // Format Engineer
    const worksheet3 = workbook.getWorksheet("Format_Eng");

    worksheet3.getRow(2).getCell(4).value = name;

    for (let i = 5; i <= 11; i++) {
      const _date = moment(sunday, "YYYYMMDD")
        .add(i - 5, "days")
        .format("YYYYMMDD")
        .toString();

      worksheet3.getRow(i).getCell(2).value = `${_date.slice(
        0,
        4
      )}/${_date.slice(4, 6)}/${_date.slice(6, 8)}`;

      worksheet3.getRow(i).getCell(4).value = resultsHr
        .filter(
          a =>
            moment(a.workdate, "YYYYMMDD")
              .subtract(i - 5, "days")
              .format("YYYYMMDD")
              .toString() === sunday
        )
        .reduce((s, itm) => {
          return s + itm.pjname + ": " + itm.comment + "\n";
        }, "");
    }

    const pjGroup = resultsHr
      .map(a => ({
        pjid: a.pjid,
        pjname: a.pjname,
        worktime: a.worktime
      }))
      .reduce((group, itm) => {
        group[itm.pjid] = group[itm.pjid]
          ? [...group[itm.pjid], { pjname: itm.pjname, worktime: itm.worktime }]
          : [{ pjname: itm.pjname, worktime: itm.worktime }];
        return group;
      }, {});
    // console.log(pjGroup);

    if (Object.keys(pjGroup).length > 1) {
      worksheet3.duplicateRow(22, Object.keys(pjGroup).length - 1, false);
    }

    for (let i = 22; i <= Object.keys(pjGroup).length + 21; i++) {
      const _row3 = worksheet3.getRow(i);

      _row3.getCell(2).value = Number(Object.keys(pjGroup)[i - 22]);
      _row3.getCell(3).value = Object.values(pjGroup)[i - 22][0].pjname;
      _row3.getCell(4).value = Object.values(pjGroup)[i - 22].reduce(
        (a, i) => a + i.worktime,
        0
      );

      _row3.commit();
    }
  }

  await workbook.xlsx.writeFile(
    `${urlOut}${sunday}_${moment(sunday, "YYYYMMDD")
      .add(6, "days")
      .format("YYYYMMDD")
      .toString()}_${name}.xlsx`
  );
};

module.exports = CreateReportEng;
