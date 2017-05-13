//import { Observable } from 'data/observable';
import { Observable } from 'rxjs/Observable';
import { WebRtcCommon } from './webrtc.common';
import * as app from "application";

declare var io : any;
declare var java : any;
//var test = io.skyway.Peer.OnCallback;


export class WebRtc extends WebRtcCommon {

	//import io.skyway.Peer.*;

	peer : any;

	minePeerId : string;

	hisPeerId : string;
	hisDataConnection : any;

	// Peer event enum
	peerEventEnum = io.skyway.Peer.Peer.PeerEventEnum;

	// Connection event enum
	dataConnectionEventEnum = io.skyway.Peer.DataConnection.DataEventEnum;

	constructor() {

		super();

		/*var options = new io.skyway.Peer.PeerOption();
		options.key = "b3e29182-a972-4c54-b50a-a0316ebd3e66";
		options.domain = "jarggon";

		this.peer = new io.skyway.Peer.Peer(app.android.context, options);
		//console.log("WebRtc peer :: ", this.peer);

		//console.log("WebRtc eventEnum :: ", eventEnum);

		if(this.peer) {
			this.listenToPeerEvent(this.peer);
		}*/

		
	}

	connection() : Observable<any> {
		var options = new io.skyway.Peer.PeerOption();
		options.key = "b3e29182-a972-4c54-b50a-a0316ebd3e66";
		options.domain = "jarggon";

		this.peer = new io.skyway.Peer.Peer(app.android.context, options);
		//console.log("WebRtc peer :: ", this.peer);

		//console.log("WebRtc eventEnum :: ", eventEnum);

		//if(this.peer) {
		return this.listenToPeerEvent(this.peer);
		//}
	}

	/*connectTo(peerId : string) : Observable<any> {

		console.log("WebRtc :: connectTo : ", peerId)

		if(peerId)
			return this.connection(peerId);
		else
			return null;
	}*/

	connectTo(peerId : string) : Observable<any> {

		//let dataEventEnum = io.skyway.Peer.DataEventEnum;
		//console.log("WebRtc :: dataEventEnum : ", dataEventEnum.DATA)

		var option = new io.skyway.Peer.ConnectOption();
		option.metadata = "data connection";
		option.label = "c(hat";
		//console.log("ConnectOption : ", option)
		//option.serialization = "JSON";/*io.skyway.Peer.SerializationEnum.JSON;*/


		console.log("WebRtc :: Launch connection to ", peerId)

		// Close data connection if one already present
		//  !!!  To change for 3 people conversation
		if(this.hisDataConnection)
			this.hisDataConnection.close();

		this.hisDataConnection = this.peer.connect(peerId, option);

		console.log("WebRtc :: dataConnection : ", this.hisDataConnection)


		if(this.hisDataConnection) {
			return this.listenToDataConnection(this.hisDataConnection);
		}
		else
			return null;
	}

	sendMessage(message : any) : boolean {
		if(this.hisDataConnection)
			return this.hisDataConnection.send(message);
		else
			return false;
	}

	list() : Observable<Array<string>> {

		if(this.peer) {

			return Observable.create((observer) => {

				console.log("WebRtc :: Start listAllPeers ");

				this.peer.listAllPeers(new io.skyway.Peer.OnCallback({
					onCallback : (peersIds) => {
						console.log("WebRtc :: listAllPeers : ", peersIds)

						let dataArray : Array<string> = JSON.parse(peersIds);

						console.log("WebRtc :: dataArray : ", dataArray)
						console.log("WebRtc :: dataArray : ", dataArray.length)
						console.log("WebRtc :: dataArray : ", dataArray[0])

						observer.next(dataArray);
						observer.complete();

						/*dataArray.forEach((peerId) => {

							console.log("peerId != this.minePeerId ? ", peerId != this.minePeerId)

							if(peerId != this.minePeerId)
								this.hisPeerId = peerId;
						})*/
					}
				}));
			});

		}
		else
			return null
	}

	listenToPeerEvent(peer : any) : Observable<any> {

		return Observable.create((observer) => {

			console.log("WebRtc :: Start listenToPeerEvent ");

			peer.on(this.peerEventEnum.OPEN, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback OPEN : ", data)

					this.minePeerId = data;
					//this.connection(data);
					//this.list();
				}
			}));

			peer.on(this.peerEventEnum.CONNECTION, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback CONNECTION : ", data)

					// Close data connection if one already present
					//  !!!  To change for 3 people conversation
					if(this.hisDataConnection)
						this.hisDataConnection.close();

					// data receive is a dataConnection
					this.hisDataConnection = data;
					this.listenToDataConnection(this.hisDataConnection).subscribe(
						(message) => {
							console.log("listenToPeerEvent : data received !!")
							observer.next(message);
						},
						(error) => {
							console.log("listenToPeerEvent : error data received !!")
							observer.error(error);
						}
					);


					//let obj = JSON.parse(data)

					//console.log("Peer connected : ", obj.peer);
				}
			}));

			peer.on(this.peerEventEnum.CLOSE, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback CLOSE : ", data)

					observer.complete();
				}
			}));

			peer.on(this.peerEventEnum.DISCONNECTED, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback DISCONNECTED : ", data)

					observer.complete();
				}
			}));

			peer.on(this.peerEventEnum.CALL, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback CALL : ", data)
				}
			}));

			peer.on(this.peerEventEnum.ERROR, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback ERROR : ", data)

					observer.error(data);
				}
			}));

		});
	}

	listenToDataConnection(dataConnection : any) : Observable<any> {
			//let dataEventEnum = io.skyway.Peer.DataConnection.DataEventEnum

		return Observable.create((observer) => {

			console.log("WebRtc :: Start listenToDataConnection ");

			dataConnection.on(this.dataConnectionEventEnum.DATA, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: dataConnection onCallback DATA : ", data)

					observer.next(data);
				}
			}));

			dataConnection.on(this.dataConnectionEventEnum.OPEN, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: dataConnection onCallback OPEN : ", data)

					//console.log("Send message to peer...")

					//let result = dataConnection.send("Salut grego !!");

					//console.log("Send message result : ", result);
				}
			}));

			dataConnection.on(this.dataConnectionEventEnum.ERROR, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: dataConnection onCallback ERROR : ", data)

					observer.error(data);
				}
			}));

			dataConnection.on(this.dataConnectionEventEnum.CLOSE, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: dataConnection onCallback CLOSE : ", data)

					observer.complete();
				}
			}));

		});
	}
	//}

}
