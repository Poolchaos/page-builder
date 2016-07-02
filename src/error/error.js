export class Error {
  
  code;
  
  activate(params) {
    
    this.code = params.code;
  }
  
  back() {
    
    window.history.go(-1 * this.code);
  }
}