import { Component, OnInit, NgZone } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";

import {WebRtc} from 'nativescript-webrtc';

import {registerElement} from "nativescript-angular/element-registry";
registerElement("WebRtcView", () => require("nativescript-webrtc").WebRtc);

import * as permissions from 'nativescript-permissions';
declare var android : any;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];

    peersId : Array<string> = [];
    myPeerId : string;

    peerReady = false;

    private webRtc: WebRtc;

    constructor(private itemService: ItemService, private _ngZone: NgZone) {
    	this.webRtc = new WebRtc();
 	}

    ngOnInit(): void {
        this.items = this.itemService.getItems();

        permissions.requestPermission([android.Manifest.permission.CAMERA, android.Manifest.permission.RECORD_AUDIO], "I need these permissions because I'm cool")
          .then(() => {
                console.log("Woo Hoo, I have the power!");
          })
          .catch(() => {
             console.log("Uh oh, no permissions - plan B time!");
        });
    }

    connection() {
    	this.webRtc.connection().subscribe(
    		(data) => {
    			console.log("DEMO APP - webRtc.connection :: data receive ", JSON.stringify(data))

                // Necessary to re-render angular binding
                this._ngZone.run(() => {
                    if(data.type == "OPEN") {
                        this.peerReady = true;
                        this.myPeerId = data.data
                    }
                });
    		},
    		(error) => {
    			console.log("DEMO APP - webRtc.connection :: data error ", error)
    		}
		);
    }

    connectTo(peerId : string) {
    	this.webRtc.connectTo(peerId).subscribe(
    		(data) => {
    			console.log("DEMO APP - webRtc.connectTo :: data receive ", data)
    		},
    		(error) => {
    			console.log("DEMO APP - webRtc.connectTo :: data error ", error)
    		}
		);
    }

    list() {
    	this.webRtc.list().subscribe(
    		(data) => {
    			console.log("DEMO APP - webRtc.list :: data receive ", data)

                /*data.forEach((peerId) => {
                    if(peerId != this.myPeerId)
                        this.peersId.push(peerId);
                })*/

                this._ngZone.run(() => {
    			    //this.peersId = data;
                    this.peersId = [];
                    data.forEach((peerId) => {
                    if(peerId != this.myPeerId)
                        this.peersId.push(peerId);
                    })
                });
    		},
    		(error) => {
    			console.log("DEMO APP - webRtc.list :: data error ", error)
    		}
		);
    }

    call(peerId : string) {
        this.webRtc.call(peerId);
    }

    send() {
    	this.webRtc.sendMessage("Coucou les gars");
    }

    getUserMedia() {
    	this.webRtc.getUserMedia();
    }
}
