import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppStateService {
  loading = new BehaviorSubject<boolean>(false);
}
