import { Observable } from 'rxjs/Observable';
import { WebRtcCommon } from './webrtc.common';
export declare class WebRtc extends WebRtcCommon {
  // define your typings manually
  // or..
  // use take the ios or android .d.ts files and copy/paste them here
  connection(): Observable<any>;
  connectTo(peerId : string): Observable<any>;
  sendMessage(message : any) : boolean;
  list(): Observable<Array<string>>
}
