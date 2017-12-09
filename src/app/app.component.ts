import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-root",
  styles: [],
  templateUrl: "./app.html",
})
export class AppComponent {
  public title = "app";
}
