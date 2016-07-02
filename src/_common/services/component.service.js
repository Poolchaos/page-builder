
export class ComponentService {
  
  createComponent(attrs) {
    
    return components(attrs).textField();
  }
}
/*
*/
function components(attrs) {
  
  let textField = () => {
    
    let template = document.createElement('input');
    template.type = 'text';
    
//    this.setAttributes(template);
    
    return template;
  };
  
//  let setAttributes(template) {
//    
//    for(let attr of attrs) {
//      
//      template.
//    }
//  }
  
  return {
    textField: textField
  };
}
