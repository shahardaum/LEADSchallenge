import fs from "fs/promises";
import log from "@ajar/marker";

// final arr the will be displayed in the json file
const objArr = [];
const objId = {};

// async function createData() {
//   console.time("my benchmark");
//   //get arr of all files
//   let data = await fs.readdir("./LEADS", "utf-8");

//   // for each file load all the content into array
//   for (const file of data) {
//     // load content
//     let getFileContent = await fs.readFile(`./LEADS/${file}`, "utf-8");

//     // split by row for each line
//     let byLineArr = getFileContent.split("\r\n");

//     for (const line of byLineArr) {
//       let [facebook_id, full_name, email] = line.split(",");
//       let newObj = {
//         facebook_id,
//         full_name: `${full_name.slice(1, full_name.length - 2)}`,
//         email,
//       };
//       if (!objId[facebook_id]) {
//         objArr.push(newObj);
//         objId[facebook_id] = true;
//       }
//     }
//   }
//   console.log(objArr.length);
//   await fs.writeFile("./results.json", JSON.stringify(objArr, null, 2));
//   console.timeEnd("my benchmark");
// }

// Paralel;
async function createData() {
  console.time("my benchmark");
  let data = await fs.readdir("./LEADS", "utf-8");
  let pendingPromisesArr = data.map(async (file) => {
    // load content
    let getFileContent = await fs.readFile(`./LEADS/${file}`, "utf-8");

    // split by row for each line
    let byLineArr = getFileContent.split("\r\n");
    for (const line of byLineArr) {
      let [facebook_id, full_name, email] = line.split(",");
      let newObj = {
        facebook_id,
        full_name: `${full_name.slice(1, full_name.length - 2)}`,
        email,
      };
      if (!objId[facebook_id]) {
        objArr.push(newObj);
        objId[facebook_id] = true;
      }
    }
  });

  await Promise.all(pendingPromisesArr);
  await fs.writeFile("./results.json", JSON.stringify(objArr, null, 2));
  console.timeEnd("my benchmark");
  log.cyan(`Num of users is:${objArr.length}`);
}
createData();
