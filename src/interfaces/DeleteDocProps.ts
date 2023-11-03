import {Doc} from '../interfaces'

export default interface DeleteDocProps{
    doc: Doc,
    deletionHook: any,
    deletionErrored: boolean

}