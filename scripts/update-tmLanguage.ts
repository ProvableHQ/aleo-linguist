import fs from "fs";
import path from "path";
import plist from "plist";

const grammarDirectory = path.join(__dirname, "../syntaxes");
const jsonPath = path.join(grammarDirectory, "Aleo.tmLanguage.json");
const plistPath = path.join(grammarDirectory, "Aleo.tmLanguage");
const grammar = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

fs.writeFileSync(plistPath, plist.build(grammar));
