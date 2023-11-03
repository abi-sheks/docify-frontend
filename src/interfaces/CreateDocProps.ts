import {Doc} from '../interfaces'

export default interface CreateDocProps{
    message: string,
    hook: any,
    isLoading: any,
    mutateErrored: boolean,
    doc: Doc | undefined,
    canEditReaders : boolean,
    canEditWriters : boolean,
}