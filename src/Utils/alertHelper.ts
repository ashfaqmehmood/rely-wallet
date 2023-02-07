export class AlertHelper {
    static dropDown: any;
    static onClose: any;
  
    static setDropDown(dropDown: any) {
      this.dropDown = dropDown;
    }
  
    static show(type: any, title: any, message: any) {
      if (this.dropDown) {
        this.dropDown.alertWithType(type, title, message);
      }
    }
  
    static setOnClose(onClose: any) {
      this.onClose = onClose;
    }
  
    static invokeOnClose() {
      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  }