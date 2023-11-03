import {Tag} from '../interfaces'

export default interface CreateTagProps {
    hook: any,
    isLoading: any,
    message: string,
    mutateErrored: boolean,
    canMutate: boolean,
    tag: Tag | undefined,
}