import { Doc } from "../interfaces"

export const tagInDoc = (doc : Doc, tagName : string): boolean => {
    let match : boolean = false
    doc.read_tags.forEach((readTag) => {
        if (readTag === tagName) {
            match = true
        }
    })
    doc.write_tags.forEach((writeTag) => {
        if(writeTag === tagName) {
            match = true
        }
    })
    return match
}