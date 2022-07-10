export const enumTags = Object.freeze({
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
});

export const enumTypes  = Object.freeze({
    thesis: "THES",
    dissertation: "THES"
});

export const languagesMap = Object.freeze({
    por: 'Portuguese',
    eng: 'English',
    spa: 'Spanish',
    esp: 'Spanish',
    spn: 'Spanish',
    fra: 'French',
    deu: 'German',
});


export default class RisWriter {

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
