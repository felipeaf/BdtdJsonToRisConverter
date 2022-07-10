/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2022 Felipe Alexandre Ferreira
	
	This file is part of BdtdJsonToRisConverter.

	BdtdJsonToRisConverter is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	BdtdJsonToRisConverter is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with BdtdJsonToRisConverter. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

//https://en.wikipedia.org/wiki/RIS_(file_format)

const fs=require('fs')

const enumTags = {
    type: 'TY',
    title: 'TI',
    abstract: 'AB',
    endOfReference: 'ER',
    shortTitle: 'ST',
    secondaryTitle: 'T2',//journal title if applicable
    author: 'AU',
    primaryAuthor: 'A1',
    publicationYear: 'PY',
    url: 'UR',
    language: 'LA',
    keyword: 'KW'
}


Object.freeze(enumTags);

const enumTypes  = {
    thesis: "THES",
    dissertation: "THES"
}


const coalesce = (...args) =>
  args.find(_ => ![null,undefined].includes(_)
);
  
const nvl = (a,b) => a ? a: b;


class RisWriter {

    constructor(callback) {
        this.callback = callback;
    };

    genLine(key, value) {
        return key + ' -  '+value//+'\r\n';
    }

    writeLine(key,value) {
        this.callback(this.genLine(key,value));
    }

    writeBegin() {
        //RIS format doesn't differ master dissertation and doctoral thesis
        //both are the only types in BDTD
        //this data is available in entry.types[] and entry.formats[]
        this.writeLine(enumTags.type, enumTypes.thesis);//TODO RIS format doesn't differ thesis from dissertation??
    }

    writeEnd() {
        this.writeLine(enumTags.endOfReference, '');
    }

    writeTitle(title) {
        this.writeLine(enumTags.title, title);
    }
}

const languagesMap = {
    por: 'Portuguese',
    eng: 'English'
}

class BdtdConverter {
    constructor(risWriter) {
        this.risWriter=risWriter;
    }

    parse(json) {
        JSON.parse(json).records.forEach(r => this.parseEntry(r));
    }

    getLanguage(str) {
        let result =  languagesMap[str];
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

function convert(inputFile, outputFile) {
    if(!inputFile) {
        console.error("use: node index.js inputFile outputFile");
        return;
    }
    let cbResult;
    if(outputFile) {
        let writer = fs.createWriteStream(outputFile, {encoding: 'utf-8', flags: 'w'});
        cbResult = line => writer.write(line+'\r\n');
    } else {
        cbResult = console.log;
    }

    let risWriter = new RisWriter(cbResult);
    let converter = new BdtdConverter(risWriter);
    converter.parse(fs.readFileSync(inputFile, 'utf8'));
}

convert(process.argv[2], process.argv[3]);

/*
TODO
- passar arquivos de entrada e de saída
- detectar DOI em urls
    - quando houver mais de uma url, se uma for doi
- escolher abstract default de acordo com o metadado de idioma do registro (se houver). 
- instituição
- tratar campos ignorados (log, ou adicionar nos U1,U2...C1,C2... ou como nota)
*/

/*ignored fields:
- profiles from authors (entry.authors.primary["AUTHOR_NAME"].profile[])
- non-primary authors (entry.authors.???)
- contributors (entry.contributors), including contributors.advisor and contributors.referee
- institution
- department
- program
- accesslevel
- subjectsCNPQ
- formats
- types

In this following fields, when there are more than one item, only the first is not ignored:
- urls
- abstract (_por, _eng)
- languages
- publicationDates


In above items, one of both is choosen acording to default language
- subjectsPOR,  subjectsENG
- abstract_por, abstract_eng
*/