import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Desktop state: true = expanded, false = thin collapsed rail (ChatGPT style)
  private _isOpen = new BehaviorSubject<boolean>(true);
  isOpen$ = this._isOpen.asObservable();

  // Mobile drawer state: true = drawer slide-in open, false = hidden
  private _isMobileOpen = new BehaviorSubject<boolean>(false);
  isMobileOpen$ = this._isMobileOpen.asObservable();

  get isExpanded(): boolean {
    return this._isOpen.value;
  }

  get isMobileOpen(): boolean {
    return this._isMobileOpen.value;
  }

  toggleCollapse(): void {
    this._isOpen.next(!this._isOpen.value);
  }

  setCollapsed(collapsed: boolean): void {
    this._isOpen.next(!collapsed);
  }

  openMobile(): void {
    this._isMobileOpen.next(true);
  }

  closeMobile(): void {
    this._isMobileOpen.next(false);
  }

  toggleMobile(): void {
    this._isMobileOpen.next(!this._isMobileOpen.value);
  }

  closeOnNavigate(): void {
    if (this._isMobileOpen.value) {
      this._isMobileOpen.next(false);
    }
  }
}

