import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthLoadingService {
  loading = new BehaviorSubject<boolean>(false);
}
