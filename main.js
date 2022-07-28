let inputArr = process.argv.slice(2);
const { pseudoRandomBytes } = require("crypto");
const { sendFile } = require("express/lib/response");
let fs = require("fs");
let path = require("path");

let types = {
    media: ["mp4" , "mkv"],
    archives: ['zip','7z','rar','tar','gz','ar','iso','xz'],
    documents: ['docx','doc','pdf','xlsx','xls','odt','ods','odp','odg','odf','txt','ps','pptx'],
    app: ['exe','dmg','pkg','deb']
}

let command =inputArr[0];
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;

        case "organize":
            organizeFn(inputArr[1]);
            break;

        case "help":
            helpFn();
            break;
    default:
        console.log("Please Input Right command");
        break;
}

function treeFn(dirPath){
    console.log("Treee command implemented for ", dirPath);
}
function organizeFn(dirPath){
//   1. input-> directory path given.
        let destPath;
        if(dirPath == undefined){
            console.log("Kindly enter the path");
            return;
        }
        else{
            let doesExist = fs.existsSync(dirPath);
            if(doesExist){
                //   2. create->organized_files ->directory
                 destPath = path.join(dirPath,"organized_files");

                if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
                }

            }
            else {
                console.log("Kindly enter the path");
                return;
            }
        }
     
//   3.identify categories of all the files present in that input directory
//   4. copy/cut files to that prganized directory inside pf any category folder
   organizeHelper(dirPath,destPath);
}
function organizeHelper(src,destPath){
    let childrenNames = fs.readdirSync(src);
    for(let i=0;i<childrenNames.length;i++){
        let childAddress = path.join(src,childrenNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
          let category = getCategory(childrenNames[i]);
          sendFiles(childAddress,destPath,category);
        }
    }
}
function sendFiles(srcFile,dest,category){
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFile);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFile,destFilePath);
    console.log(fileName,"copied to",category);
}
function helpFn(){
    console.log(`
    List of All command:
         node main.js tree "directoryPath"
         node main.js organize "directoryPath"
         node main.js help
    `);
}
function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let type in types){
        let cTypeArray = types[type];
        for(let i=0;i<cTypeArray.length;i++){
            if(ext == cTypeArray[i]){
                return type;
            }
        }
    }
    return "others";
}