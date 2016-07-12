export class ContextMenuService {
  
  constructor() {
    
    document.addEventListener( 'contextmenu', function(e) {
      console.log(' contextmenu >>> ', e);
    });
  }
}