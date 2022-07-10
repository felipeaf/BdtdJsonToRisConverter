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

import fs from 'fs';
import convertBdtdToRis from './ConverterFacade.js';


function convert(inputFile, outputFile) {
    console.log(inputFile,outputFile);
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

    convertBdtdToRis(fs.readFileSync(inputFile, 'utf8'),cbResult)
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