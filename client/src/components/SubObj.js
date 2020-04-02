const subObjects = {
  "--Choose--": "--Choose--",
  "0": "Meeting Internal",
  "1": "Meeting Customer",
  "2": "Create Document",
  "3": "Investigation",
  "4": "Travel",
  "40": "Integration Test Report",
  "41": "Training Support",
  "99": "Other"
};

const subKeys = Object.keys(subObjects).join("*");
const subValues = Object.values(subObjects).join("*");

export default subObjects;
export { subKeys, subValues };
