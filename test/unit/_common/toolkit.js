export class Toolkit {
  
  toJson(obj){
    return JSON.parse(this.toJsonString(obj));
  }
  
  toJsonString(obj){
    return JSON.stringify(obj);
  }
  
  toArray(it) {
    return Array.from(it);
  }
}