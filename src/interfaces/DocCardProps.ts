import { Tag, Doc } from '../interfaces'

export default interface DocCardProps {
    doc: Doc,
    deletionHook: any,
    hook: any,
    isLoading: boolean,
    deletionErrored: boolean,
    mutateErrored: boolean,
    allTags: any
}