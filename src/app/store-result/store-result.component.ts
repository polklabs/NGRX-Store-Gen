import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { storeSettings } from '../model/store.model';
import { FirstLetter } from '../pipe/titleCase.pipe';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-store-result',
  templateUrl: './store-result.component.html',
  styleUrls: ['./store-result.component.scss']
})
export class StoreResultComponent implements OnInit, OnChanges {

  @Input() entity: boolean;
  @Input() name: string;
  @Input() upsertMany: boolean;
  @Input() addAll: boolean;
  @Input() load: boolean;
  @Input() save: boolean;
  @Input() delete: boolean;

  actionsTitle: string = '.actions.ts';
  actions: string = '';
  indexTitle: string = 'index.ts';
  index: string = '';
  reducerTitle: string = '.reducer.ts';
  reducer: string = '';
  effectsTitle: string = '.effects.ts';
  effects: string = '';
  serviceTitle: string = '.service.ts';
  service: string = '';
  modelTitle: string = '.model.ts';
  model: string = ''; 

  dataParser: string = '';
  dataParserActionImport: string = '';
  dataParserReducerImport: string = '';
  dataParserConstructor: string = '';
  effectsIndex: string = '';
  reducerIndex1: string = '';
  reducerIndex2: string = '';
  storeModule: string = '';

  constructor(private firstLetter: FirstLetter,
    private changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.index = null;
    this.actions = null;
    this.reducer = null;
    this.effects = null;
    this.service = null;
    this.model = null;
    this.dataParser = null;
    this.dataParserActionImport = null;
    this.dataParserReducerImport = null;
    this.dataParserConstructor = null;
    this.effectsIndex = null; 
    this.reducerIndex1 = null;
    this.reducerIndex2 = null;
    this.storeModule = null;

    this.changeDetectorRef.detectChanges();
    
    this.loadIndex();
    this.loadActions();
    this.loadReducer();
    this.loadEffects();
    this.loadService();
    this.loadModel();
  }

  openSnackBar() {
    this._snackBar.open('Copied to clipboard', 'Dismiss', {
      duration: 2000,
    });
  }

  camelToUnderscore(key: string): string {
    let i = 0;
    while(i < key.length && key.charAt(i)==key.charAt(i).toUpperCase()){
      i++;
    }
    if(i > 0 && i < key.length){
      i--;
    }
    let section1 = key.slice(0, i);
    let section2 = key.slice(i);

    section2 = section2.replace(/\.?([A-Z]+)/g, function (x,y){return "-" + y.toLowerCase()}).replace(/^_/, "");

    let result = section1.toLowerCase() + section2;
    if(result.charAt(0)=='-'){
      result = result.slice(1);
    }
    return result;
 }

  loadIndex() {
    let upperName = this.firstLetter.transform(this.name, true);
    let lowerName = this.firstLetter.transform(this.name, false);
    let fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity?'Entity':'DataTable'}`;
    let fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity?'Entity':'DataTable'}`;
    let snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    let snakeCase = this.camelToUnderscore(upperName);
    this.index =
      `import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ${fullNameLower}Adapter } from './${snakeCase}.reducer';
import { EntityState } from '../../reducers.index';

export const selectEntityModuleState = createFeatureSelector<EntityState>('entities');
export const get${upperName}State = createSelector( selectEntityModuleState, (s: EntityState) => s.${fullNameLower});
export const {
    selectIds: getIds,
    selectEntities: getEntities,
    selectAll: getAll,
    selectTotal: getTotal,
} = ${fullNameLower}Adapter.getSelectors(get${upperName}State);

export const get${upperName}ById = (id: string) => createSelector(getEntities, (entities) => entities[id]);${this.load?
`
export const isLoading = createSelector(get${upperName}State, (s) => s.loading);
export const hasError = createSelector(get${upperName}State, (s) => s.error);`:''}${this.save?
`
export const saveSuccess = createSelector(getEmployeeCertificationState, (s) => s.saveSuccess);`:''}

/**
 * Add Custom selectors here
 */
`;
  }

  loadActions() {
    let upperName = this.firstLetter.transform(this.name, true);
    let lowerName = this.firstLetter.transform(this.name, false);
    let fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity?'Entity':'DataTable'}`;
    let fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity?'Entity':'DataTable'}`;
    let snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    let snakeCase = this.camelToUnderscore(upperName);
    this.actionsTitle = `${snakeCase}.actions.ts`;
    this.actions = '';
    this.actions = 
    `import { Action } from '@ngrx/store';
import { ${fullNameUpper} } from 'src/app/store/model/${snakeCaseFull}.model';
import { Info } from 'src/app/shared/model/info.model';

export enum ${upperName}ActionTypes {
    ${this.addAll?`AddAll = '[${fullNameUpper}] Add All'`:`UpsertMany = '[${fullNameUpper}] Upsert Many'`},${this.load?
      `
      Load = '[${fullNameUpper}] Load',
      LoadSuccess = '[${fullNameUpper}] Load Success',
      LoadFail = '[${fullNameUpper}] Load Fail',`:
      ''}${this.save?
      `
      Save = '[${fullNameUpper}] Save',
      SaveSuccess = '[${fullNameUpper}] Save Success',
      SaveFail = '[${fullNameUpper}] Save Fail',`:
      ''}${this.delete?
      `
      Delete = '[${fullNameUpper}] Delete',
      DeleteSuccess = '[${fullNameUpper}] Delete Success',
      DeleteFail = '[${fullNameUpper}] Delete Fail',`:''}
}

export class ${this.addAll?'AddAll':'UpsertMany'} implements Action {
  readonly type = ${upperName}ActionTypes.${this.addAll?'AddAll':'UpsertMany'};
  constructor(public cargo: Info<${fullNameUpper}>[]) {}
}
${this.load?
  `
  export class Load implements Action {
    readonly type = ${upperName}ActionTypes.Load;
  }

  export class LoadSuccess implements Action {
    readonly type = ${upperName}ActionTypes.LoadSuccess;
  }

  export class LoadFail implements Action {
    readonly type = ${upperName}ActionTypes.LoadFail;
  }
  `:
  ''
}${this.save?
  `
  export class Save implements Action {
    readonly type = ${upperName}ActionTypes.Save;
    constructor(public cargo: ${fullNameUpper}) {}
  }

  export class SaveSuccess implements Action {
    readonly type = ${upperName}ActionTypes.SaveSuccess;
  }

  export class SaveFail implements Action {
    readonly type = ${upperName}ActionTypes.SaveFail;
  }
  `:
  ''
}${this.delete?
  `
  export class Delete implements Action {
    readonly type = ${upperName}ActionTypes.Delete;
    constructor(public cargo: string) {}
  }

  export class DeleteSuccess implements Action {
    readonly type = ${upperName}ActionTypes.DeleteSuccess;
    constructor(public cargo: string) {}
  }

  export class DeleteFail implements Action {
    readonly type = ${upperName}ActionTypes.DeleteFail;
  }
  `:
  ''
}
export type ${upperName}Actions =${this.load?
    `
    | Load
    | LoadSuccess
    | LoadFail`:
    ''
    }${this.save?
    `
    | Save
    | SaveSuccess
    | SaveFail`:
    ''
    }${this.delete?
    `
    | Delete
    | DeleteSuccess
    | DeleteFail`:
    ''
    }
    | ${this.addAll?'AddAll':'UpsertMany'};`;
  }

  loadReducer() {
    let upperName = this.firstLetter.transform(this.name, true);
    let lowerName = this.firstLetter.transform(this.name, false);
    let fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity?'Entity':'DataTable'}`;
    let fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity?'Entity':'DataTable'}`;
    let snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    let snakeCase = this.camelToUnderscore(upperName);
    this.reducerTitle = `${snakeCase}.reducer.ts`;
    this.reducerIndex1 = `${fullNameLower}: ${fullNameUpper}State;`;
    this.reducerIndex2 = `${fullNameLower}: ${fullNameLower}Reducer,`;
    this.reducer =
    `import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ${upperName}Actions, ${upperName}ActionTypes } from './${snakeCase}.actions';
import { ${fullNameUpper} } from 'src/app/store/model/${snakeCaseFull}.model';
import { Info } from 'src/app/shared/model/info.model';

export interface ${fullNameUpper}State extends EntityState<Info<${fullNameUpper}>> {${this.load?
      `
      loading: boolean;
      error: boolean;`:''}${this.save?
      `
      saveSuccess: boolean;`:''}${this.delete?
      `
      deleteSuccess: boolean;`:''}
}

export const ${fullNameLower}Adapter = createEntityAdapter<Info<${fullNameUpper}>>();

const default${upperName} = {${this.load?
  `
  loading: false,
  error: null,`:''}${this.save?
  `
  saveSuccess: false,`:''}${this.delete?
  `
  deleteSuccess: false,`:''}
}

export const initialState: ${fullNameUpper}State = ${fullNameLower}Adapter.getInitialState(default${upperName});

export function ${fullNameLower}Reducer(
    state: ${fullNameUpper}State = initialState,
    action: ${upperName}Actions) {
    switch (action.type) {${this.load?`
        case ${upperName}ActionTypes.Load:
            return {
                ...state,
                loading: true,
                error: false
            };
        case ${upperName}ActionTypes.LoadSuccess:
            return {
                ...state,
                loading: false,
                error: false
            };
        case ${upperName}ActionTypes.LoadFail:
            return {
                ...state,
                loading: false,
                error: true
            };`:''}${this.save?`
        case ${upperName}ActionTypes.Save:
            return {
                ...state,
                saveSuccess: false
            };
        case ${upperName}ActionTypes.SaveSuccess:
            return {
                ...state,
                saveSuccess: true
            };`:''}${this.delete?`
        case ${upperName}ActionTypes.DeleteSuccess:
            return ${fullNameLower}Adapter.removeOne(action.cargo, {...state});`:''}
        case ${upperName}ActionTypes.${this.addAll?'AddAll':'UpsertMany'}:
            return ${fullNameLower}Adapter.${this.addAll?'addAll':'upsertMany'}(action.cargo, {...state});
        default:
            return state;
    }
}`;
  }

  loadEffects() {
    let upperName = this.firstLetter.transform(this.name, true);
    let lowerName = this.firstLetter.transform(this.name, false);
    let fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity?'Entity':'DataTable'}`;
    let fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity?'Entity':'DataTable'}`;
    let snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    let snakeCase = this.camelToUnderscore(upperName);
    this.effectsTitle = `${snakeCase}.effects.ts`;
    if(!this.load && !this.save && !this.delete){
      this.effects = '//No effects needed';
      return;
    }
    this.effectsIndex = `${upperName}Effects,`;
    this.effects = 
    `import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as ${lowerName}Actions from './${snakeCase}.actions';
import { ${upperName}ActionTypes } from './${snakeCase}.actions';

/*RXJS*/
import { mergeMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ${upperName}DataService } from './${snakeCase}.service';

@Injectable()
export class ${upperName}Effects {
    constructor(private actions$: Actions,
        private ${lowerName}DataService: ${upperName}DataService) { }${this.load?`
    
    @Effect()
    load${upperName}$: Observable<Action> = this.actions$.pipe(
        ofType(${upperName}ActionTypes.Load),
        mergeMap(() => this.${lowerName}DataService.load${upperName}s().pipe(
                map((result: boolean) => result ? new ${lowerName}Actions.LoadSuccess() : new ${lowerName}Actions.LoadFail())
            )
        )
    );`:''}${this.save?`
    
    @Effect()
    save${upperName}$: Observable<Action> = this.actions$.pipe(
        ofType(${upperName}ActionTypes.Save),
        mergeMap((action: ${lowerName}Actions.Save) => this.${lowerName}DataService.save${upperName}(action.cargo).pipe(
                map((result: boolean) => result ? new ${lowerName}Actions.SaveSuccess()  : new ${lowerName}Actions.SaveFail())
            )
        )
    );`:''}${this.delete?`
    
    @Effect()
    delete${upperName}$: Observable<Action> = this.actions$.pipe(
        ofType(${upperName}ActionTypes.Delete),
        mergeMap((action: ${lowerName}Actions.Delete) => this.${lowerName}DataService.delete${upperName}(action.cargo).pipe(
                map((result: boolean)  => result ? new ${lowerName}Actions.DeleteSuccess(action.cargo) : new ${lowerName}Actions.DeleteFail())
            )
        )
    );`:''}

}`;
  }

  loadService() {
    let upperName = this.firstLetter.transform(this.name, true);
    let lowerName = this.firstLetter.transform(this.name, false);
    let fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity?'Entity':'DataTable'}`;
    let fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity?'Entity':'DataTable'}`;
    let snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    let snakeCase = this.camelToUnderscore(upperName);
    this.serviceTitle = `${snakeCase}.service.ts`;
    this.dataParser = `if (payload.${fullNameUpper}) {
  this.${fullNameLower}Store.dispatch(new ${fullNameLower}Actions.${this.addAll?'AddAll':'UpsertMany'}(this.parse${this.entity?'Entity':'DataTable'}(payload.${fullNameUpper})));
}`;
    this.dataParserActionImport = `import * as ${fullNameLower}Actions from './${this.entity?'entity':'data-table'}/${snakeCase}/${snakeCase}.actions';`;
    this.dataParserReducerImport = `import { ${fullNameUpper}State } from './${this.entity?'entity':'data-table'}/${snakeCase}/${snakeCase}.reducer';`;
    this.dataParserConstructor = `private ${fullNameLower}Store: Store<${fullNameUpper}State>,`;
    if(!this.load && !this.save && !this.delete){
      this.service = '//No service needed';
      return;
    }
    this.storeModule = `${upperName}DataService,`;
    this.service = 
    `import { Injectable } from '@angular/core';
import { DataService } from 'src/app/core/service/data.service';
import { Observable, AsyncSubject } from 'rxjs';
import { CallParameters } from 'src/app/shared/model/callparameters.model';
import { Message } from 'src/app/shared/model/message.model';
import { NotificationService } from 'src/app/core/service/notification.service';
import { ${fullNameUpper} } from 'src/app/store/model/${snakeCaseFull}.model';
import { DataParserService } from 'src/app/store/data-parser.service';

@Injectable()
export class ${upperName}DataService {
    
    constructor(
        private dataService: DataService,
        private dataParserService: DataParserService,
        private notificationService: NotificationService
    ) { }${this.load?`

    public load${upperName}s(): Observable<boolean> {
        var result = new AsyncSubject<boolean>();
        const cp = new CallParameters('', '', '');

        let sub = this.dataService.getData(cp).subscribe(
            (msg: Message) => {

                result.next(msg.Success);
                result.complete();
                sub.unsubscribe();

                if(!msg.Success) {
                    this.notificationService.popError(msg.Msg, 'Error loading ${lowerName}s', msg.InternalMsg);
                    return;
                }

                this.dataParserService.parse(msg);

            }
        )

        return result;
    }`:''}${this.save?`

    public save${upperName}(${fullNameLower}: ${fullNameUpper}): Observable<boolean> {
        var result = new AsyncSubject<boolean>();
        const cp = new CallParameters('', '', '', JSON.stringify(${fullNameLower}));
        this.notificationService.popAction('Attempting to save ${lowerName}');

        let sub = this.dataService.postData(cp).subscribe(
            (msg: Message) => {

                result.next(msg.Success);
                result.complete();
                sub.unsubscribe();

                if(!msg.Success) {
                    this.notificationService.popError(msg.Msg, 'Error saving ${lowerName}', msg.InternalMsg);
                    return;
                } else {
                    this.notificationService.popSuccess('', 'Successfully saved ${lowerName}');
                }

                this.dataParserService.parse(msg);
            }
        );

        return result;
    }`:''}${this.delete?`

    public delete${upperName}(id: string): Observable<boolean> {
        var result = new AsyncSubject<boolean>();
        const cp = new CallParameters('', '', '', id);
        this.notificationService.popAction('Attempting to delete ${lowerName}');
        
        let sub = this.dataService.deleteData(cp).subscribe(
            (msg: Message) => {

                result.next(msg.Success);
                result.complete();
                sub.unsubscribe();

                if(!msg.Success) {
                    this.notificationService.popError(msg.Msg, 'Error deleting ${lowerName}', msg.InternalMsg);
                    return;
                } else {
                    this.notificationService.popSuccess('', 'Successfully deleted ${lowerName}');
                }

                this.dataParserService.parse(msg);
            }
        );

        return result;
    }`:''}

}`;
  }

  loadModel() {
    let upperName = this.firstLetter.transform(this.name, true);
    let lowerName = this.firstLetter.transform(this.name, false);
    let fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity?'Entity':'DataTable'}`;
    let fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity?'Entity':'DataTable'}`;
    let snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    let snakeCase = this.camelToUnderscore(upperName);
    this.modelTitle = `${snakeCaseFull}.model.ts`;
    this.model = 
    `export class ${fullNameUpper} {
  $id: string;
  $type: string;
  //Add properties here
}`;
  }

}
