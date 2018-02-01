import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class SaveCanvasService {

  private save: Subject<void> = new Subject<void>();

  public getSaveObservable(): Observable<void> {
    return this.save.asObservable();
  }

  public next() {
    this.save.next();
  }
}
