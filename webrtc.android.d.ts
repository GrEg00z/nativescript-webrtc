import { Observable } from 'rxjs/Observable';
import { ContentView } from 'ui/content-view';
export declare class WebRtc extends ContentView {
    peer: any;
    minePeerId: string;
    mineStream: any;
    isTheCaller: boolean;
    dataConnection: any;
    mediaConnection: any;
    peerEventEnum: any;
    dataConnectionEventEnum: any;
    mediaConnectonEventEnum: any;
    autoAnswer: boolean;
    constructor();
    connection(): Observable<any>;
    connectTo(peerId: string): Observable<any>;
    sendMessage(message: any): boolean;
    list(): Observable<Array<string>>;
    call(peerId: string, isTheCaller?: boolean): void;
    getUserMedia(): void;
    listenToPeerEvent(peer: any): Observable<any>;
    answerProcess(mediaConnection: any): void;
    listenToDataConnection(dataConnection: any): Observable<any>;
    listenToMediaConnection(mediaConnection: any): void;
}
