export default interface Doc{
  id : string,
  title : string, 
  read_tags : Array<string>,
  write_tags : Array<string>,
  restricted : boolean,
  slug : string,
  creator : string,
}
