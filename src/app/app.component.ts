import {Component, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {UserListComponent} from "./features/user/components/user-list/user-list.component";
import {UserAddComponent} from "./features/user/components/user-add/user-add.component";
import {UserEditComponent} from "./features/user/components/user-edit/user-edit.component";
import {UserDetailsComponent} from "./features/user/components/user-details/user-details.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, UserListComponent, UserAddComponent, UserEditComponent, UserDetailsComponent]
})
export class AppComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {

  }
}
""
