import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isOpen = new BehaviorSubject<boolean>(true);
  isOpen$ = this._isOpen.asObservable();

  toggleCollapse(): void {
    this._isOpen.next(!this._isOpen.value);
  }
}
