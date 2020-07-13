const express = require("express");
const mysql = require("mysql");
// const connectDB = require("./config/db");
const fs = require("fs");
const { exec } = require("child_process");
const util = require("util");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const CreateReportEng = require("./reports/CreateReportEng");
const CreateReportDev = require("./reports/CreateReportDev");
const CreateReportDevEng = require("./reports/CreateReportDevEng");
const CreateTimeSheet = require("./reports/CreateTimeSheet");
const path = require("path");
require("dotenv").config();
const moment = require("moment");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const config = require("config");
const { check, validationResult } = require("express-validator");

const sendEmail = require("./utils/sendEmail");

const app = express();

app.use(helmet());

// connectDB();

// Body parser
app.use(express.json({ extended: false }));
app.use(cors());
app.use(xss());
app.use(hpp());

// Cookie parser
app.use(cookieParser());

// MongoDB
// app.use("/api/users", require("./routes/users"));
// app.use("/api/auth", require("./routes/auth"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per windowMs
});
app.use(limiter);

// mySQL;
const db_config = {
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "projectdata",
};

// const db_config = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
// };

let connection;

let query;

const handleDisconnect = () => {
  connection = mysql.createConnection(db_config);
  // Recreate the connection, since the old one cannot be reused.
  query = util.promisify(connection.query).bind(connection);
  console.log(query);

  connection.connect((err) => {
    if (err) {
      // The server is either down or restarting (takes a while sometimes).
      console.log(`Error when connecting to db: ${err} at ${Date()}`);
      setTimeout(handleDisconnect, 2000);
      // We introduce a delay before attempting to reconnect, to avoid a hot loop,
      // and to allow our node script to process asynchronous requests in the meantime.
    }

    console.log(`Connected as thread id: ${connection.threadId} at ${Date()}`);
  });

  connection.on("error", function (err) {
    console.log(`db error: ${err} at ${Date()}`);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually lost due to either server restart,
      // or a connnection idle timeout (the wait_timeout server variable configures this)
      handleDisconnect();
    } else {
      throw err;
    }
  });
};

handleDisconnect();

app.get("/api/workload/get", async (req, res) => {
  try {
    const { sunday } = req.query;

    const QUERY_WORKLOAD = `SELECT CONCAT(UPPER(SUBSTR(name,1,1)),SUBSTR(name,2)) AS name, 
    pjid, worktime/60 AS worktime 
    FROM (projectdata.t_personalrecode) WHERE 
    (workdate BETWEEN ${sunday} AND ${moment(sunday, "YYYYMMDD")
      .add(6, "days")
      .format("YYYYMMDD")
      .toString()}) 
      ORDER BY name ASC`;
    const results = await query(QUERY_WORKLOAD);

    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/xlsx/weekly", (req, res) => {
  const { name, sunday } = req.query;

  const file = fs.createReadStream(
    `./public/output/${sunday}_${moment(sunday, "YYYYMMDD")
      .add(6, "days")
      .format("YYYYMMDD")
      .toString()}_${name}.xlsx`
  );

  file.pipe(res);
});

app.get("/api/xlsx/timesheet", (req, res) => {
  const { name, monthStartDate } = req.query;

  const file = fs.createReadStream(
    `./public/output/FlextimeSheetForm_${moment(monthStartDate, "YYYYMM")
      .format("YYYYMM")
      .toString()}_${name}.xlsx`
  );

  file.pipe(res);
});

app.get("/api/weekly/get", async (req, res) => {
  try {
    const { name, sunday, role } = req.query;

    const QUERY_WEEKLY = `SELECT workdate, pjid, pjname, deadline, expecteddate, percent,
    worktime, comment, starthour, startmin, endhour, endmin, count, name, subid, subname
      FROM (projectdata.t_personalrecode) WHERE name = '${name}'
      && (workdate BETWEEN ${sunday} AND ${moment(sunday, "YYYYMMDD")
      .add(6, "days")
      .format("YYYYMMDD")
      .toString()})
      ORDER BY workdate ASC, CAST(count AS UNSIGNED) ASC`;
    const results = await query(QUERY_WEEKLY);
    if (role === "Engineer") {
      CreateReportEng(name, sunday, results);
    } else if (role === "Developer") {
      CreateReportDev(name, sunday, results);
    } else if (role === "Eng & Dev") {
      CreateReportDevEng(name, sunday, results);
    }
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

const copyWorkSheet = (name) => {
  console.log("Hello " + name);
  exec(
    `dotnet "${__dirname}/public/netcoreapp3.1/ConsoleApp2.dll" Akiyama 20200601`,
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
};

app.get("/api/timesheet/get", async (req, res) => {
  try {
    const { name, monthStartDate } = req.query;

    const QUERY_MONTHLY = `SELECT workdate, worktime, starthour, startmin, endhour, endmin
      FROM (projectdata.t_personalrecode) WHERE name = '${name}'
      && (workdate BETWEEN ${monthStartDate} AND ${moment(
      monthStartDate,
      "YYYYMMDD"
    )
      .add(1, "months")
      .subtract(1, "days")
      .format("YYYYMMDD")
      .toString()})
      ORDER BY workdate ASC, CAST(count AS UNSIGNED) ASC`;
    const results = await query(QUERY_MONTHLY);
    CreateTimeSheet(name, monthStartDate, results, copyWorkSheet);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/api/projects/add", async (req, res) => {
  try {
    const {
      name,
      workdate,
      count,
      pjid,
      pjname,
      subid,
      subname,
      status,
      comment,
      worktime,
      starthour,
      startmin,
      endhour,
      endmin,
    } = req.body.params;
    const INSERT_PRODUCTS_QUERY = `INSERT INTO projectdata.t_personalrecode
    (name, workdate, count, pjid, pjname, deadline, expecteddate, subid, subname, percent, comment, worktime, starthour, startmin, endhour, endmin)
    VALUES('${name}','${workdate}','${count}','${pjid}','${pjname}',
    (SELECT deadline FROM projectdata.t_projectmaster WHERE pjid = '${pjid}'),
    (SELECT expecteddate FROM projectdata.t_projectmaster WHERE pjid = '${pjid}'),
    '${subid}','${subname}','${status}','${comment
      .split("")
      .map((a) => {
        if (a === "'") {
          return "\\".concat("'");
        } else if (a === '"') {
          return "\\".concat('"');
        } else if (a === "\\") {
          return "\\".concat("\\");
        } else {
          return a;
        }
      })
      .join(
        ""
      )}', '${worktime}', '${starthour}', '${startmin}', '${endhour}', '${endmin}')`;
    await query(INSERT_PRODUCTS_QUERY);
    console.log(`${name} added data at ${Date()}`);
    return res.send("Successfully added weekly data");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/api/projects/update", async (req, res) => {
  try {
    const {
      name,
      workdate,
      count,
      pjid,
      pjname,
      subid,
      subname,
      status,
      comment,
      worktime,
      starthour,
      startmin,
      endhour,
      endmin,
    } = req.body.params;
    const UPDATE_PRODUCTS_QUERY = `UPDATE projectdata.t_personalrecode
    SET pjid = '${pjid}', pjname = '${pjname}',
    deadline = (SELECT deadline FROM projectdata.t_projectmaster WHERE pjid = '${pjid}'),
    expecteddate = (SELECT expecteddate FROM projectdata.t_projectmaster WHERE pjid = '${pjid}'),
    subid = '${subid}', subname = '${subname}', percent = '${status}', comment = '${comment
      .split("")
      .map((a) => {
        if (a === "'") {
          return "\\".concat("'");
        } else if (a === '"') {
          return "\\".concat('"');
        } else if (a === "\\") {
          return "\\".concat("\\");
        } else {
          return a;
        }
      })
      .join("")}', worktime = '${worktime}',
    starthour = '${starthour}', startmin = '${startmin}', endhour = '${endhour}', endmin = '${endmin}'
    WHERE name = '${name}' AND workdate = '${workdate}' AND count = '${count}'`;
    await query(UPDATE_PRODUCTS_QUERY);
    console.log(`${name} updated data at ${Date()}`);
    return res.send("Successfully updated weekly data");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/api/projects/delete", async (req, res) => {
  try {
    const { name, workdate, count } = req.query;
    const DELETE_PRODUCTS_QUERY = `DELETE FROM projectdata.t_personalrecode WHERE name = '${name}' AND workdate = '${workdate}' AND count = '${count}'`;
    await query(DELETE_PRODUCTS_QUERY);
    console.log(`${name} deleted data at ${Date()}`);
    return res.send("Successfully deleted weekly data");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/personal", async (req, res) => {
  try {
    const { name, workdate } = req.query;
    const QUERY_PERSONAL = `SELECT pjid, subid, percent, comment, worktime, starthour, startmin, endhour, endmin
      FROM (SELECT PC.*, PJ.scode FROM projectdata.t_personalrecode AS PC
      JOIN projectdata.t_projectmaster AS PJ
      ON PC.pjid = PJ.pjid
      WHERE scode = 0) AS TB WHERE name = '${name}' && workdate = '${workdate}' 
      ORDER BY CAST(count AS UNSIGNED) ASC`;
    const results = await query(QUERY_PERSONAL);
    console.log(`${name} logged in at ${Date()}`);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

const QUERY_PROJECTS =
  "SELECT pjid, pjname_en, pjname_jp FROM projectdata.t_projectmaster WHERE scode = 0";
const QUERY_SUBS =
  "SELECT subid, subname_en, subname_jp FROM projectdata.m_submaster";

app.get("/api/projects", async (req, res) => {
  try {
    const results = await query(QUERY_PROJECTS);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/subs", async (req, res) => {
  try {
    const results = await query(QUERY_SUBS);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/daily", async (req, res) => {
  try {
    const { name, sortBy } = req.query;
    const QUERY_DAILY = `SELECT workdate, pjid, pjname, deadline, expecteddate,
    subid, subname, percent, comment, worktime, starthour, startmin, endhour, endmin
      FROM (projectdata.t_personalrecode) WHERE name = '${name}' ORDER BY workdate ${sortBy}, 
      CAST(count AS UNSIGNED) ${sortBy}`;
    const results = await query(QUERY_DAILY);
    console.log(`${name} queried daily history at ${Date()}`);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/daily/members", async (req, res) => {
  try {
    const QUERY_MEMBERS = `SELECT name FROM projectdata.t_personalrecode GROUP BY name`;
    const results = await query(QUERY_MEMBERS);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/comments", async (req, res) => {
  try {
    const { name } = req.query;
    const RESET_SQL_MODE = `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`;

    await query(RESET_SQL_MODE);
    console.log(`Comments sent at ${Date()}`);

    const QUERY_COMMENTS = `SELECT pjid, comment, CC FROM (SELECT pjid, comment, COUNT(comment) AS CC
    FROM (SELECT PC.*, PJ.scode FROM projectdata.t_personalrecode AS PC
      JOIN projectdata.t_projectmaster AS PJ
      ON PC.pjid = PJ.pjid
      WHERE scode = 0) AS TB
      WHERE TB.name = '${name}' GROUP BY comment) AS B
      ORDER BY CC DESC`;

    const results = await query(QUERY_COMMENTS);
    return res.json({
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// Register Users
app.post(
  "/api/users",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const SEARCH_VALID_EMAIL = `SELECT * FROM projectdata.emaillist
      WHERE email ='${email}'`;
      const search_valid_email = await query(SEARCH_VALID_EMAIL);

      if (!search_valid_email[0]) {
        return res.status(400).json({
          msg:
            "This email does not exist in database. Please contact your admin for assistance!",
        });
      }

      const SEARCH_USER = `SELECT * FROM projectdata.namelist
      WHERE name ='${name}'`;
      const search_res = await query(SEARCH_USER);

      const SEARCH_EMAIL = `SELECT * FROM projectdata.namelist
      WHERE email ='${email}'`;
      const search_res2 = await query(SEARCH_EMAIL);

      if (search_res[0]) {
        return res.status(400).json({ msg: "Username already exists" });
      } else if (search_res2[0]) {
        return res.status(400).json({ msg: "This email is already in use" });
      } else {
        const user = {
          name,
          email,
          password,
        };

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        const payload = {
          user: {
            name: user.name,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
          }
        );

        const INSERT_USER = `INSERT INTO projectdata.namelist
        (name, email, password) VALUES('${user.name}','${user.email}','${user.password}')`;
        await query(INSERT_USER);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/auth
// @desc     Get logged user
// @access   Private
app.get("/api/auth", auth, async (req, res) => {
  try {
    const SEARCH_USER = `SELECT * FROM projectdata.namelist
    WHERE name ='${req.user.name}'`;
    const search_res = await query(SEARCH_USER);

    const user = {
      name: search_res[0].name,
      email: search_res[0].email,
    };

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
app.post(
  "/api/auth",
  [
    check("name", "Please include a valid name").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
      let search_res;
      const SEARCH_USER = `SELECT * FROM projectdata.namelist
      WHERE name ='${name}'`;
      search_res = await query(SEARCH_USER);

      if (!search_res[0]) {
        const SEARCH_EMAIL = `SELECT * FROM projectdata.namelist
        WHERE email ='${name}'`;
        search_res = await query(SEARCH_EMAIL);
        if (!search_res[0]) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }
      }

      const isMatch = await bcrypt.compare(password, search_res[0].password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          name: search_res[0].name,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST api/auth/forgotpassword
// @desc     Forgot password
// @access   Public
app.post("/api/auth/forgotpassword", async (req, res) => {
  try {
    const SEARCH_USER = `SELECT * FROM projectdata.namelist
    WHERE email ='${req.body.email}'`;
    const search_res = await query(SEARCH_USER);

    if (!search_res[0]) {
      return res.status(404).json({ msg: "There is no user with that email" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire 10 minutes
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    const UPDATE_RESET = `UPDATE projectdata.namelist
    SET resetPasswordToken = '${resetPasswordToken}', resetPasswordExpire = '${resetPasswordExpire}'
    WHERE email ='${req.body.email}'`;
    await query(UPDATE_RESET);

    // Create reset url
    const resetUrl = `http://akasaka2.e-technostar.com:14789/resetpassword/${resetToken}`;

    const message = `Hi ${search_res[0].name},
\nYou are receiving this email because we received a password reset request for your Report Maker account.
\nPlease click the link below to reset your password:
\n${resetUrl}\n\nIf you did not request a password reset, no further action is required.
\n
Regards,
TechnoStar Email Service
    `;

    await sendEmail({
      email: req.body.email,
      subject: "Reset Password Notification - Report Maker",
      message,
    });
    res.status(200).json({ data: "Email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/auth/resetpassword
// @desc     Reset password
// @access   Private
app.get("/api/auth/resetpassword", async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.query.resetToken)
      .digest("hex");

    const SEARCH_USER = `SELECT * FROM projectdata.namelist
      WHERE resetPasswordToken ='${resetPasswordToken}' AND resetPasswordExpire >'${Date.now()}'`;
    const search_res = await query(SEARCH_USER);

    if (!search_res[0]) {
      return res.status(400).json({ msg: "Invalid token" });
    } else {
      return res.status(200).json({
        msg: search_res[0].email,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/auth/updatepassword/
// @desc     Reset password
// @access   Private
app.put(
  "/api/auth/updatepassword",
  [
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const SEARCH_USER = `SELECT * FROM projectdata.namelist
      WHERE email ='${req.body.email}'`;
      const search_res = await query(SEARCH_USER);

      if (!search_res[0]) {
        return res.status(400).json({ msg: "User doesn't exist" });
      }

      // Set new password
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const UPDATE_PASSWORD = `UPDATE projectdata.namelist 
      SET password = '${hashedPassword}', resetPasswordToken = '', resetPasswordExpire = 0 
      WHERE email ='${search_res[0].email}'`;
      await query(UPDATE_PASSWORD);

      const payload = {
        user: {
          name: search_res[0].name,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

let PORT;

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );

  PORT = process.env.PORT_PROD || 14789;
} else {
  PORT = process.env.PORT_DEV || 4000;
}

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
