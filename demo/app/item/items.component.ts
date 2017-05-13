import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";

import {WebRtc} from 'nativescript-webrtc';

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];

    peersId : Array<string> = [];

    private webRtc: WebRtc;

    constructor(private itemService: ItemService) {
    	this.webRtc = new WebRtc();
 	}

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }

    connection() {
    	this.webRtc.connection().subscribe(
    		(data) => {
    			console.log("DEMO APP - webRtc.connection :: data receive ", data)
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

    			this.peersId = data;
    		},
    		(error) => {
    			console.log("DEMO APP - webRtc.list :: data error ", error)
    		}
		);
    }

    send() {
    	this.webRtc.sendMessage("Coucou les gars");
    }
}
