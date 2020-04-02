const Excel = require("exceljs");
const moment = require("moment");

const CreateTimeSheet = async (name, monthStartDate, results) => {
  const workbook = new Excel.Workbook();

  const monthEndDate = moment(monthStartDate, "YYYYMMDD")
    .add(1, "months")
    .subtract(1, "days")
    .format("YYYYMMDD")
    .toString();

  const urlIn = "./public/Format_Timesheet.xlsx";
  const urlOut = "./public/output/";

  await workbook.xlsx.readFile(urlIn);

  if (results.length > 0) {
    // Time Sheet
    const worksheet5 = workbook.getWorksheet(5);
    console.log(
      "duration",
      moment
        .duration(moment("10:00", "HH:mm").diff(moment("09:23", "HH:mm")))
        .asMinutes()
    );

    worksheet5.getRow(2).getCell(2).value = new Date(
      Number(monthStartDate.slice(0, 4)),
      Number(monthStartDate.slice(4, 6)) - 1,
      Number(monthStartDate.slice(6, 8)) + 1
    );

    worksheet5.getRow(2).getCell(4).value = new Date(
      Number(monthEndDate.slice(0, 4)),
      Number(monthEndDate.slice(4, 6)) - 1,
      Number(monthEndDate.slice(6, 8)) + 1
    );
    //年月日〜
    worksheet5.getRow(3).getCell(3).value = name;

    if (Number(monthEndDate.slice(6, 8)) > 28) {
      worksheet5.duplicateRow(33, Number(monthEndDate.slice(6, 8)) - 28, true);

      for (let i = 34; i <= Number(monthEndDate.slice(6, 8)) + 5; i++) {
        worksheet5.getRow(i).getCell(2).value = {
          formula: `=B${i - 1}+1`
        };

        worksheet5.getRow(i).getCell(3).value = {
          formula: `=WEEKDAY(B${i})`
        };
      }
    }

    const dateGroup = results.reduce((group, itm) => {
      group[itm.workdate] = group[itm.workdate]
        ? [
            ...group[itm.workdate],
            {
              worktime: itm.worktime,
              starttime: moment(`${itm.starthour}:${itm.startmin}`, "HH:mm")
                .format("HH:mm")
                .toString(),
              endtime: moment(`${itm.endhour}:${itm.endmin}`, "HH:mm")
                .format("HH:mm")
                .toString()
            }
          ]
        : [
            {
              worktime: itm.worktime,
              starttime: moment(`${itm.starthour}:${itm.startmin}`, "HH:mm")
                .format("HH:mm")
                .toString(),
              endtime: moment(`${itm.endhour}:${itm.endmin}`, "HH:mm")
                .format("HH:mm")
                .toString()
            }
          ];
      return group;
    }, {});

    console.log(dateGroup);

    for (let i = 6; i <= Number(monthEndDate.slice(6, 8)) + 5; i++) {
      const tempDate = (Number(monthStartDate) + i - 6).toString();

      if (dateGroup[tempDate]) {
        const duration = dateGroup[tempDate].reduce(
          (sum, itm, idx, arr) =>
            idx === arr.length - 1
              ? sum
              : sum +
                moment
                  .duration(
                    moment(arr[idx + 1].starttime, "HH:mm").diff(
                      moment(itm.endtime, "HH:mm")
                    )
                  )
                  .asMinutes(),
          0
        );

        worksheet5.getRow(i).getCell(4).value =
          dateGroup[tempDate][0].starttime;

        worksheet5.getRow(i).getCell(5).value =
          dateGroup[tempDate][dateGroup[tempDate].length - 1].endtime;

        worksheet5.getRow(i).getCell(6).value = moment(
          `${Math.floor(duration / 60)}:${duration % 60}`,
          "HH:mm"
        )
          .format("HH:mm")
          .toString();

        worksheet5.getRow(i).getCell(7).value = {
          formula: `=E${i}-D${i}-F${i}`
        };
      }
    }

    // worksheet5.getRow(37).getCell(7).value = {
    //   formula: `=SUM(G${6}:G${Number(monthEndDate.slice(6, 8)) + 5}`
    // };

    //moment("00:00", "HH:mm")
  }

  await workbook.xlsx.writeFile(
    `${urlOut}FlextimeSheetForm_${moment(monthStartDate, "YYYYMM")
      .format("YYYYMM")
      .toString()}_${name}.xlsx`
  );
};

module.exports = CreateTimeSheet;
