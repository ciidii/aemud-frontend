import {Injectable} from '@angular/core';
import {MessageTemplate} from "../models/message.template";

@Injectable({
  providedIn: 'root'
})
export class SmsTamplateStateService {
  private _messageTemplatesList: MessageTemplate[] = [];
  private _selectedTemplate: MessageTemplate | null = null;

  constructor() {
  }

  get messageTemplatesList(): MessageTemplate[] {
    return this._messageTemplatesList;
  }

  set messageTemplatesList(value: MessageTemplate[]) {
    this._messageTemplatesList = value;
  }

  get selectedTemplate(): MessageTemplate | null {
    return this._selectedTemplate;
  }

  set selectedTemplate(value: MessageTemplate | null) {
    this._selectedTemplate = value;
  }
}
