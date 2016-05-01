import {Observable} from 'data/observable';
import {YourPlugin} from 'nanativescript-intro-slides';

export class HelloWorldModel extends Observable {
  public message: string;
  private yourPlugin: YourPlugin;

  constructor() {
    super();

    this.yourPlugin = new YourPlugin();
    this.message = this.yourPlugin.message;
  }
}