import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appContextMenuTrigger]',
  standalone: true
})
export class ContextMenuTriggerDirective {
  // Emits the mouse event and the data associated with the clicked item
  @Output() contextMenuTrigger = new EventEmitter<{ event: MouseEvent, data: any }>();

  // Input to receive the data associated with the item this directive is on
  @Input('appContextMenuTriggerData') data: any;

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    console.log("La directive marche");
    event.preventDefault(); // Prevent default browser context menu
    this.contextMenuTrigger.emit({event, data: this.data});
  }
}
