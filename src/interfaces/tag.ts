export default interface Tag{
    id : string,
    name : string,
    users : Array<string>,
    admins : Array<string>,
    creator : string,
}