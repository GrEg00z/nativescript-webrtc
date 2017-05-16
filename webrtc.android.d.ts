import { Observable } from 'rxjs/Observable';
import { ContentView } from 'ui/content-view';
export declare class WebRtc extends ContentView {
    peer: any;
    minePeerId: string;
    mineStream: any;
    dataConnection: any;
    mediaConnection: any;
    peerEventEnum: any;
    dataConnectionEventEnum: any;
    mediaConnectonEventEnum: any;
    constructor();
    connection(): Observable<any>;
    connectTo(peerId: string): Observable<any>;
    sendMessage(message: any): boolean;
    list(): Observable<Array<string>>;
    call(peerId: string): void;
    getUserMedia(): void;
    listenToPeerEvent(peer: any): Observable<any>;
    listenToDataConnection(dataConnection: any): Observable<any>;
    listenToMediaConnection(mediaConnection: any): void;
}
