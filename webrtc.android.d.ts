import { Observable } from 'rxjs/Observable';
import { WebRtcCommon } from './webrtc.common';
export declare class WebRtc extends WebRtcCommon {
    peer: any;
    minePeerId: string;
    hisPeerId: string;
    hisDataConnection: any;
    peerEventEnum: any;
    dataConnectionEventEnum: any;
    constructor();
    connection(): Observable<any>;
    connectTo(peerId: string): Observable<any>;
    sendMessage(message: any): boolean;
    list(): Observable<Array<string>>;
    listenToPeerEvent(peer: any): Observable<any>;
    listenToDataConnection(dataConnection: any): Observable<any>;
}
