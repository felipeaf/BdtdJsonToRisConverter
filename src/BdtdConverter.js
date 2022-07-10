import {enumTags, languagesMap} from "./RisWriter.js";
import { nvl } from "./utils.js";

export default class BdtdConverter {
    constructor(risWriter) {
        this.risWriter=risWriter;
    }

    parse(json, endCb) {
        JSON.parse(json).records.forEach(r => this.parseEntry(r));
        if(endCb) endCb();
    }

    getLanguage(str) {
        let result =  languagesMap[str.toLowerCase()];
        return nvl(result,str);
    }

    getAbstract(entry) {
        let resultArray = nvl(entry.abstract_por, entry.abstract_eng);
        return resultArray ? resultArray[0]: undefined;
    }

    parseEntry(entry) {
        this.risWriter.writeBegin();//TYPE, all being treated as thesis...
        this.risWriter.writeTitle(entry.title);

        let abstract = this.getAbstract(entry);
        if (abstract) this.risWriter.writeLine(enumTags.abstract, abstract);
        
        Object.keys(entry.authors.primary).forEach(authorName => this.risWriter.writeLine(enumTags.primaryAuthor, authorName));
  
        this.risWriter.writeLine(enumTags.publicationYear, entry.publicationDates[0]);
        this.risWriter.writeLine(enumTags.url, entry.urls[0]);
        this.risWriter.writeLine(enumTags.language, this.getLanguage(entry.languages[0]));
        
        if(entry.subjectsPOR) {
            entry.subjectsPOR.forEach(i => i.forEach(j => this.risWriter.writeLine(enumTags.keyword, j)));
        }
        
        if(entry.subjectsENG) {
            entry.subjectsENG.forEach(i => i.forEach(j => this.risWriter.writeLine(enumTags.keyword, j)));
        }
        
        this.risWriter.writeEnd();
    }
}