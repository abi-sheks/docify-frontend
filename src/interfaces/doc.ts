export default interface Doc{
  id : string,
  title : string, 
  read_tags : Array<string>,
  write_tags : Array<string>,
  accessors : Array<string>,
  restricted : boolean,
  slug : string,
  creator : string,
}
