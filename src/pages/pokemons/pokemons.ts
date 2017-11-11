import { Component } from '@angular/core';
import { Events, NavController, NavParams, ModalController, PopoverController, LoadingController } from 'ionic-angular';

import { ActionsPage } from '../actions/actions';
import { DetailPage } from '../detail/detail';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

import { SearchFilter } from '../../pipes/search/search';

@Component({
    selector: 'page-pokemons',
    templateUrl: 'pokemons.html'
})
export class PokemonsPage {
    private search_filter:string = "";

    private master:Array<Object> = [];

    private pokemonType:string = "";

    private loading:any;

    constructor(public navCtrl:NavController, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider, public modalCtrl:ModalController, public events:Events, public popoverCtrl:PopoverController, public navParams:NavParams, public loadingCtrl: LoadingController) {
        this.pokemonType = this.navParams.data;

        this.events.subscribe('configSaved', data => {
            console.log("Event: config");
            //this.data.refresh();
           // this.getPokemons();
        });
        this.events.subscribe('pokedexSaved', data => {
            console.log("Event: pokedex");
            //this.data.refresh();
            //this.getPokemons();
        });

        this.events.subscribe('menu:closed', data => {
            console.log("Event: menu:closed");
            //this.data.refresh();
            this.getPokemons();
        });
    }

    showLoading() {
       this.loading = this.loadingCtrl.create({
          content: "Please wait...",
        });
        this.loading.present();
    }

    ionViewDidEnter() {
        this.getPokemons();
    }

    getPokemons() {
        this.data.refresh();
        
        this.showLoading();
        console.log("Regenerating master list...");
        this.master = this.data.getPokemons(this.pokemonType, this.search_filter);
        console.log(this.master.length);
        this.loading.dismiss();
    }

    search() {
        console.log("SEARCH: ");
        //this.getPokemons();
    }

    showActions(event) {
        let popover = this.popoverCtrl.create(ActionsPage, {pokemons:this.master});
        popover.present({ev: event});
    }

    getStats(type) {
        return this.data.getStats(this.pokemonType)[type];
    }

    selectPokemon(single_pokemon, event:Event) {
        switch (event.target['nodeName']) {
            case 'SPAN':
            case 'button':
                return ;
            default:
                console.log(event.target['nodeName']);
        }

        let modal = this.modalCtrl.create(DetailPage, {'pokemon':single_pokemon, 'parent': this});
        modal.present();
    }

    virtualScrollTracker(index, pokemon) {
        return pokemon['number'];
    }
}
