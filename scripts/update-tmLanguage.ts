import fs from "fs";
import path from "path";
import plist from "plist";

(async () => {
  const expectationsFileJSON = path.join(
    __dirname,
    "../syntaxes/Aleo.tmLanguage.json"
  );
  const expectationsFilePlist = path.join(
    __dirname,
    "../syntaxes/Aleo.tmLanguage"
  );
  // To get latest version of leo.tmLanguage, need to have actual leo-lsp repository in the same level 
  // After run script if there are changes in syntaxes folder, make commit and push
  const tmLanguageExpectationFile = path.join(
    __dirname,
    "../../leo-lsp/vscode-extension/syntaxes/Aleo.tmLanguage.json"
  );
  const isExist = await fs.existsSync(tmLanguageExpectationFile);
  if (!isExist) {
    throw "Aleo.tmLanguage.json not found!";
  }
  const content = await fs.promises.readFile(
    tmLanguageExpectationFile,
    { encoding: "utf8" }
  );
  const plistContent = plist.build(JSON.parse(content));
  await fs.promises.writeFile(
    expectationsFileJSON,
    content,
  );
  await fs.promises.writeFile(
    expectationsFilePlist,
    plistContent,
  );
})();
