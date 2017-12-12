import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, HostListener } from "@angular/core";
import { ActionCreators } from "redux-undo";
import { IAppState } from "../store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "pixel-canvas",
  styleUrls: ["./pixel-canvas.css"],
  templateUrl: "./pixel-canvas.html",
})
export class PixelCanvasComponent {

  private static readonly Z = 90;

  constructor(private $ngRedux: NgRedux<IAppState>) {}

  @HostListener("document:keydown", ["$event"])
  public keyInput(event: KeyboardEvent) {
    // Don't want to intercept or intrude on any interactions with input elements
    if ((event.target as HTMLElement).tagName === "INPUT") {
      return;
    }

    if (event.ctrlKey && event.keyCode === PixelCanvasComponent.Z) {
      if (event.shiftKey) {
        this.$ngRedux.dispatch(ActionCreators.redo());
      } else {
        this.$ngRedux.dispatch(ActionCreators.undo());
      }
    }
  }
}
