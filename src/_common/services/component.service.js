
export class ComponentService {
  
  createComponent(attrs) {
    
//    console.log(' attrs >>>> ', attrs);;
    
    return {
      textField: components(attrs).textField,
      div: components(attrs).div
    }
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
  
  let div = () => {
    
    let template = document.createElement('div');
    
    template.className = 'default_comp';
    
    template.style.width = '100px';
    template.style.height = '100px';
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
    textField: textField,
    div: div
  };
}
