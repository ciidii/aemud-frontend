import {Injectable} from '@angular/core';
import {MessageTemplateModel} from "../../../core/models/message-template.model";
import {RecipientsTemplateModel} from "../../../core/models/recipients-template.model";

@Injectable({
  providedIn: 'root'
})
export class SmsTamplateStateService {
  private _messageTemplatesList: MessageTemplateModel[] = [];
  private _recipientsTemplateList: RecipientsTemplateModel []= [];
  private _selectedMessageTemplate: MessageTemplateModel | null = null;
  private _recipientsTemplatesList: MessageTemplateModel |null  = null;

  constructor() {
  }

  get messageTemplatesList(): MessageTemplateModel[] {
    return this._messageTemplatesList;
  }

  set messageTemplatesList(value: MessageTemplateModel[]) {
    this._messageTemplatesList = value;
  }

  get selectedMessageTemplate(): MessageTemplateModel | null {
    return this._selectedMessageTemplate;
  }

  set selectedMessageTemplate(value: MessageTemplateModel | null) {
    this._selectedMessageTemplate = value;
  }


  get recipientsTemplatesList(): MessageTemplateModel | null {
    return this._recipientsTemplatesList;
  }

  set recipientsTemplatesList(value: MessageTemplateModel | null) {
    this._recipientsTemplatesList = value;
  }


  get recipientsTemplateList(): RecipientsTemplateModel[] {
    return this._recipientsTemplateList;
  }

  set recipientsTemplateList(value: RecipientsTemplateModel[]) {
    this._recipientsTemplateList = value;
  }
}
