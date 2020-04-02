const Data = [...Array(2).keys()].reduce((dataArr, index) => {
  dataArr.push({
    key: index,
    selectedProjectId: "--Choose--",
    selectedProjectName: "--Choose--",
    selectedSubId: "--Choose--",
    selectedSubName: "--Choose--",
    startTime: null,
    endTime: null,
    workTime: "00:00",
    status: null,
    comment: null
  });
  return dataArr;
}, []);

export default Data;
