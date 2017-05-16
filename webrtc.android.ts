//import { Observable } from 'data/observable';
import { Observable } from 'rxjs/Observable';
import { WebRtcCommon } from './webrtc.common';
import * as app from "application";

//declare var io : any;
declare var java : any;
//var test = io.skyway.Peer.OnCallback;
//declare var android : any;

var nativeView : any;

//var test = io.skyway.Peer.Browser.Canvas;

import {AndroidActivity} from './activity';
import {ContentView} from 'ui/content-view';


//org.nativescript.widgets.ContentLayout.generateViewId()

declare module io {
    module skyway {
        module Peer {
            module Browser {
                class Canvas {
                	//static addSrc(stream : any, trackNo : any);
                	constructor(context : any);
                	addSrc(stream : any, trackNo : any);
                }

                class Navigator {
                	static initialize(peer : any);
                	static getUserMedia(options : any);
                }

                class MediaConstraints {
                	videoFlag : boolean;
                }
            }
            class Peer {
            	static PeerEventEnum : any;
            	constructor(context : any, option : any);
            }
            class DataConnection {
            	static DataEventEnum : any;
            }
            class MediaConnection {
            	static MediaEventEnum : any;
            }

            class PeerOption {
            	key : any;
            	domain : any;
            }

            class ConnectOption {
            	metadata : any;
            	label : any;
            	serialization : any;
            }

            class CallOption {

            }

            class OnCallback {
            	constructor(callback : any);
            }

            class BaseConnection {
            	static SerializationEnum : any;
            }
        }
    }
}


export class WebRtc extends ContentView {//WebRtcCommon {

	//import io.skyway.Peer.*;

	peer : any;
	minePeerId : string;
	mineStream : any;

	dataConnection : any;
	mediaConnection : any;

	// Peer event enum
	peerEventEnum = io.skyway.Peer.Peer.PeerEventEnum;

	// Connection event enum
	dataConnectionEventEnum = io.skyway.Peer.DataConnection.DataEventEnum;

	// Media connection event
	mediaConnectonEventEnum = io.skyway.Peer.MediaConnection.MediaEventEnum;


	constructor() {

		super();

		console.log("this.nativeView ", this.nativeView);

		setTimeout(() => {
			console.log("this.nativeView after timeout ", this.nativeView);

			if(this.nativeView) {
				console.log("this.nativeView android : ", this.android)
				console.log("this.nativeView height : ", this.height)
				console.log("this.nativeView id : ", this.nativeView)

				nativeView = this.nativeView;
			}
		}, 0)
		//console.log("this.nativeView height ", this.nativeView.height);
	}

	connection() : Observable<any> {

		var options = new io.skyway.Peer.PeerOption();
		options.key = "b3e29182-a972-4c54-b50a-a0316ebd3e66";
		options.domain = "jarggon";

		this.peer = new io.skyway.Peer.Peer(app.android.context, options);

		//test
		//let baseConnection = new io.skyway.Peer.BaseConnection();
		console.log("io.skyway.Peer.BaseConnection : ", io.skyway.Peer.BaseConnection)

		return this.listenToPeerEvent(this.peer);
	}

	connectTo(peerId : string) : Observable<any> {

		var option = new io.skyway.Peer.ConnectOption();
		option.metadata = "data connection";
		option.label = "chat";
		console.log("ConnectOption : ", option.serialization)
		//option.serialization = "JSON";/*io.skyway.Peer.SerializationEnum.JSON;*/

		//test
		//console.log("io.skyway.Peer.BaseConnection.SerializationEnum : ", io.skyway.Peer.BaseConnection.SerializationEnum)


		console.log("WebRtc :: Launch connection to ", peerId)

		// Close data connection if one already present
		//  !!!  To change for 3 people conversation
		if(this.dataConnection)
			this.dataConnection.close();

		this.dataConnection = this.peer.connect(peerId, option);

		console.log("WebRtc :: dataConnection : ", this.dataConnection)


		if(this.dataConnection) {
			return this.listenToDataConnection(this.dataConnection);
		}
		else
			return null;
	}

	sendMessage(message : any) : boolean {
		if(this.dataConnection)
			return this.dataConnection.send(message);
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

						/*console.log("WebRtc :: dataArray : ", dataArray)
						console.log("WebRtc :: dataArray : ", dataArray.length)
						console.log("WebRtc :: dataArray : ", dataArray[0])*/

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


	call(peerId : string) {

		console.log("WebRtc :: Peer to call : ", peerId)
		console.log("WebRtc :: this.Peer : ", this.peer)
		console.log("WebRtc :: this.mineStream : ", this.mineStream)

		let callOptions = new io.skyway.Peer.CallOption()
		console.log("WebRtc :: callOptions : ", callOptions)

		this.mediaConnection = this.peer.call(peerId, this.mineStream, callOptions);

		console.log("WebRtc :: this.mediaConnection : ", this.mediaConnection);
		this.listenToMediaConnection(this.mediaConnection)/*.subscribe(
			(stream) => {
				console.log("WebRtc :: Stream Received from listenToMediaConnection : ", stream)
			},
			(error) => {
				console.log("WebRtc :: Stream Error from listenToMediaConnection : ", error)
			}
		);*/
	}

	getUserMedia() : void {

		// TO DO !!!
		// --> IMPLEMENT REQUEST PERMISSIONS LIKE NATIVESCRIPT-PERMISSIONS PLUGIN
	    console.log("this.nativeView ", this.nativeView);
		console.log("WebRtc :: Start init Navigator")
		io.skyway.Peer.Browser.Navigator.initialize(this.peer);

		var constraints = new io.skyway.Peer.Browser.MediaConstraints();
		//constraints.videoFlag = new java.lang.Boolean(false);
		console.log("constraints : ", constraints)


		this.mineStream = io.skyway.Peer.Browser.Navigator.getUserMedia(constraints);
		console.log("WebRtc :: media stream ", this.mineStream);
		console.log("WebRtc :: media stream getVideoTracks ", this.mineStream.getVideoTracks())


		if(nativeView) {
			console.log("WebRtc :: start to add media stream...");

			let canvas = new io.skyway.Peer.Browser.Canvas(app.android.context);
			console.log("WebRtc :: canvas : ", canvas);
			//console.log("WebRtc :: canvas type : ", typeof(canvas));

			canvas.addSrc(this.mineStream, 0)
			console.log("WebRtc :: media stream added !! ");

			nativeView.addView(canvas);
			console.log("WebRtc :: canvas added to app view !! ");
		}



	}

	listenToPeerEvent(peer : any) : Observable<any> {

		return Observable.create((observer) => {

			console.log("WebRtc :: Start listenToPeerEvent ");

			peer.on(this.peerEventEnum.OPEN, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback OPEN : ", data)

					this.minePeerId = data;

					let obj = {type : "OPEN", data : data}
					observer.next(obj);
					//this.connection(data);
					//this.list();
				}
			}));

			peer.on(this.peerEventEnum.CONNECTION, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: onCallback CONNECTION : ", data)

					// Close data connection if one already present
					//  !!!  To change for 3 people conversation
					if(this.dataConnection)
						this.dataConnection.close();

					// data receive is a dataConnection
					this.dataConnection = data;
					this.listenToDataConnection(this.dataConnection).subscribe(
						(message) => {
							console.log("listenToPeerEvent : data received !!")
							let obj = {type : "DATA", data : message}
							observer.next(obj);
						},
						(error) => {
							console.log("listenToPeerEvent : error data received !!")
							observer.error(error);
						}
					);
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

					//setTimeout(() => {

						//data.answer(this.mineStream);
						data.answer(this.mineStream);

						setTimeout(() => {
							this.listenToMediaConnection(data)
						}, 5000);

						/*.subscribe(
							(stream) => {
								console.log("WebRtc :: listenToMediaConnection stream : ", stream)
							}
						);*/
					//})
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
	
	listenToMediaConnection(mediaConnection : any) {
		//return Observable.create((observer) => {

			console.log("WebRtc :: Start listenToMediaConnection ", mediaConnection);
			console.log("this.mediaConnectonEventEnum ", this.mediaConnectonEventEnum);
			console.log("this.mediaConnectonEventEnum.STREAM ", this.mediaConnectonEventEnum.STREAM);

			mediaConnection.on(this.mediaConnectonEventEnum.STREAM, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: mediaConnection onCallback STREAM : ", data)
					//observer.next(data);
				}
			}));

			console.log("WebRtc :: end of mediaConnection onCallback STREAM : ")
			

			/*mediaConnection.on(this.dataConnectionEventEnum.CLOSE, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: dataConnection onCallback CLOSE : ", data)
					observer.complete();
				}
			}));

			

			mediaConnection.on(this.dataConnectionEventEnum.ERROR, new io.skyway.Peer.OnCallback({
				onCallback : (data) => {
					console.log("WebRtc :: dataConnection onCallback ERROR : ", data)
					observer.error(data);
				}
			}));*/
		//});
	}
}