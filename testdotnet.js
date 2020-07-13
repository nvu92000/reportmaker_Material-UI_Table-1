const { exec } = require("child_process");

exec(
  'dotnet "D:\\AKIYAMA\\Work\\reportmaker_Material-UI_Table\\public\\netcoreapp3.1\\ConsoleApp2.dll" Akiyama 20200601',
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  }
);
