import { Component, OnInit } from '@angular/core';
import { storeSettings } from '../model/store.model';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {

  entity: boolean = true;
  name: string = '';

  //addAll or UpsertMany
  upsertMany: boolean = true;
  addAll: boolean = false;

  load: boolean = false;
  save: boolean = false;
  delete: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
