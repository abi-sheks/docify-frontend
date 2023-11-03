import {Tag} from '../interfaces'

export default interface DeleteTagProps {
    tag: Tag,
    deletionHook: any,
    deletionErrored: boolean
}