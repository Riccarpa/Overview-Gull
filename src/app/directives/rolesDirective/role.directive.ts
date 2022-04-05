import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective {

  constructor(private view:ViewContainerRef,private template:TemplateRef<any>) { }



  @Input() set appRole(condition: boolean) {
    if (condition) {
      this.view.createEmbeddedView(this.template);
    } else if (!condition) {
      this.view.clear();  
    }
  }


 
}
