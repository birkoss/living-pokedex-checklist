import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Tabs } from '../pages/tabs/tabs';

import { ConfigProvider } from '../providers/config/config';
import { DataProvider } from '../providers/data/data';
import { PokedexProvider } from '../providers/pokedex/pokedex';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;

    constructor(platform:Platform, statusBar:StatusBar, splashScreen:SplashScreen, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider) {

        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            /* Load the configs */
            this.config.load().then(result => {
                this.data.load().then(result => {
                    this.pokedex.load().then(result => {
                        this.pokedex.init(this.data.getAllPokemons(), this.config.getFilters());
                        this.refreshPokemons();
                        this.rootPage = Tabs;
                    });
                });
            });
        });
    }

    configChanged(ev, type) {
        console.log("CONFIG CHANGED: " + ev);
        this.config.save();
    }

    refreshPokemons() {
        console.log("REFRESH POKEMONS");
        this.data.refresh();
    }
}
