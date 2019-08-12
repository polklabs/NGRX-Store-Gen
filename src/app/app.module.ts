import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { StoreFormComponent } from './store-form/store-form.component';
import { StoreResultComponent } from './store-result/store-result.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FirstLetter } from './pipe/titleCase.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StoreFormComponent,
    StoreResultComponent,
    FirstLetter
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [FirstLetter],
  bootstrap: [AppComponent]
})
export class AppModule { }
