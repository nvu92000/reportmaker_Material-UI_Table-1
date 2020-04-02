const projects = {
  // Selected: --Choose--
  "--Choose--": "--Choose--",
  "200001": "Jupiter V311",
  "200003": "P2P Maintenance",
  "200004": "JPT ANA",
  "200005": "Jupiter Transfer",
  "200006": "TogoPost Development",
  "200007": "Imabari SF037",
  "200008": "CAE Engineering Service",
  "200009": "Development Maintenance",
  "200010": "TTVS Request",
  "200011": "Jupiter V40",
  "200012": "Jupiter V41",
  "200013": "Mazda Quality Management",
  "200014": "Sunshine",
  "200015": "HCSR Engineering Service",
  "200016": "Hatch Cover Opt. System",
  "200017": "Marketing",
  "200019": "Star License System",
  "200020": "User Conference",
  "200021": "Muffer Modeling",
  "200022": "Oasis",
  "200023": "Crack",
  "200024": "Support",
  "200026": "Dispatch Business",
  "200027": "Engineering Service",
  "200028": "Coverity",
  "200029": "New Python Definition",
  "200030": "Jupiter Operation Video",
  "200031": "JDG",
  "200032": "HCSR Opt Eff Improvement",
  "200033": "OpenFoam",
  "200034": "JPT OPTISHAPE",
  "200035": "GeoGraphia Dev Phase 2",
  "200036": "Mutec Software Integration",
  "200037": "IKI G",
  "200038": "Research Acoustic Mod Eff",
  "200039": "Hatch Cover Opt System",
  "200040": "FrontISTR",
  "200041": "One Push Meshing Dev",
  "200042": "Jupiter Ver411",
  "777777": "Pre Sales Support",
  "888888": "Customer support",
  "999999": "Other"
};

const projectKeys = Object.keys(projects).join("*"); //create in array dataIndex - a "selected value", push...
const projectValues = Object.values(projects).join("*");

export default projects;
export { projectKeys, projectValues };
