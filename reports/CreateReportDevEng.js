const Excel = require("exceljs");
const moment = require("moment");

const CreateReportDevEng = async (name, sunday, results) => {
  const workbook = new Excel.Workbook();

  const urlIn = "./public/Format_Eng_Dev.xlsx";
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
      moment(sunday, "YYYYMMDD").startOf("month").week() +
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

    const _resultsHr = results.map((obj, idx) => {
      return { ...obj, worktime: obj.worktime / 60 };
    });

    const _pjGroup = _resultsHr
      .map((a) => ({
        pjname: a.pjname,
        comment: a.comment,
        worktime: a.worktime,
      }))
      .reduce((group, itm, idx, arr) => {
        group[itm.pjname] = group[itm.pjname]
          ? {
              ...group[itm.pjname],
              [itm.comment]: arr
                .filter(
                  (a) => a.pjname === itm.pjname && a.comment === itm.comment
                )
                .reduce((a, i) => a + i.worktime, 0),
            }
          : {
              [itm.comment]: arr
                .filter(
                  (a) => a.pjname === itm.pjname && a.comment === itm.comment
                )
                .reduce((a, i) => a + i.worktime, 0),
            };
        return group;
      }, {});
    // console.log(_pjGroup);

    const resultsHr = _resultsHr
      .slice()
      .reduce((s, itm, idx, arr) => {
        if (
          arr
            .filter((a, i) => i !== idx)
            .some((a) => a.pjname === itm.pjname && a.comment === itm.comment)
        ) {
          arr[idx] = {};
          return s;
        } else {
          s.push({
            ...arr[idx],
            worktime: _pjGroup[itm.pjname][`${itm.comment}`],
          });
          return s;
        }
      }, [])
      .sort((a, b) => a.pjid - b.pjid)
      .reduce((s, itm, idx, arr) => {
        if (arr[idx + 1] && itm.pjid === arr[idx + 1].pjid) {
          s.push(itm);
          return s;
        } else {
          s.push(itm);
          s.push({
            workdate: "",
            pjid: "",
            pjname: "",
            deadline: "",
            expecteddate: "",
            percent: "",
            worktime: "",
            comment: "",
            starthour: "",
            startmin: "",
            endhour: "",
            endmin: "",
            count: "",
            name: "",
            subid: "",
            subname: "",
          });
          return s;
        }
      }, []);

    // console.log(resultsHr);

    if (resultsHr.length > 1) {
      worksheet2.duplicateRow(8, resultsHr.length - 1, true);
    }

    for (let i = 8; i <= resultsHr.length + 7; i++) {
      const _row2 = worksheet2.getRow(i);
      if (resultsHr[i - 8].comment) {
        if (resultsHr[i - 8].comment.length < 40) {
          _row2.height = 15;
        } else if (resultsHr[i - 8].comment.length < 79) {
          _row2.height = 30;
        } else if (resultsHr[i - 8].comment.length < 118) {
          _row2.height = 45;
        } else if (resultsHr[i - 8].comment.length < 157) {
          _row2.height = 60;
        } else if (resultsHr[i - 8].comment.length < 196) {
          _row2.height = 75;
        } else if (resultsHr[i - 8].comment.length < 235) {
          _row2.height = 90;
        } else _row2.height = 105;
      }

      for (let j = 2; j <= 8; j++) {
        _row2.getCell(j).value =
          resultsHr[i - 8].pjid &&
          (isNaN(Object.values(resultsHr[i - 8]).slice(1, 8)[j - 2])
            ? Object.values(resultsHr[i - 8]).slice(1, 8)[j - 2]
            : Number(Object.values(resultsHr[i - 8]).slice(1, 8)[j - 2]));
      }

      _row2.commit();
      worksheet2.mergeCells(`H${i}:K${i}`);
      worksheet2.getCell(`K${i}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
    }

    worksheet2.getRow(resultsHr.length + 8).getCell(7).value = {
      formula: `=SUM(G${8}:G${resultsHr.length + 7})`,
      result: resultsHr.map((obj) => obj.worktime).reduce((sum, i) => sum + i),
    };

    worksheet2.mergeCells(`B${resultsHr.length + 8}:F${resultsHr.length + 8}`);
    worksheet2.getCell(`F${resultsHr.length + 8}`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };

    worksheet2.mergeCells(`H${resultsHr.length + 8}:K${resultsHr.length + 8}`);
    worksheet2.getCell(`K${resultsHr.length + 8}`).border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };

    for (let i = 1; i < 13; i++) {
      worksheet2.getColumn(i).eachCell((cell) => {
        if (cell.value === null) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF" },
          };
        }
      });
    }

    for (let i = 1; i < 13; i++) {
      worksheet2.getRow(resultsHr.length + 9).getCell(i).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF" },
      };
    }

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

      worksheet3.getRow(i).getCell(4).value = _resultsHr
        .filter(
          (a) =>
            moment(a.workdate, "YYYYMMDD")
              .subtract(i - 5, "days")
              .format("YYYYMMDD")
              .toString() === sunday
        )
        .reduce((s, itm, idx, arr) => {
          if (
            arr
              .filter((a, i) => i !== idx)
              .some((a) => a.pjname === itm.pjname && a.comment === itm.comment)
          ) {
            arr[idx] = {};
            return s;
          } else return s + itm.pjname + ": " + itm.comment + "\n";
        }, "");
    }

    const pjGroup = _resultsHr
      .map((a) => ({
        pjid: a.pjid,
        pjname: a.pjname,
        worktime: a.worktime,
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

module.exports = CreateReportDevEng;
