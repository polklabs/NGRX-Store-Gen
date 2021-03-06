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

  actionsTitle = '.actions.ts';
  actions = '';
  indexTitle = 'index.ts';
  index = '';
  reducerTitle = '.reducer.ts';
  reducer = '';
  effectsTitle = '.effects.ts';
  effects = '';
  serviceTitle = '.service.ts';
  service = '';
  modelTitle = '.model.ts';
  model = '';

  dataParser = '';
  dataParserActionImport = '';
  dataParserConstructor = '';
  effectsIndex = '';
  reducerIndex1 = '';
  reducerIndex2 = '';
  storeModule = '';

  constructor(
    private firstLetter: FirstLetter,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar) { }

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
    this.snackBar.open('Copied to clipboard', 'Dismiss', {
      duration: 2000,
    });
  }

  camelToUnderscore(key: string): string {
    let i = 0;
    while (i < key.length && key.charAt(i) === key.charAt(i).toUpperCase()) {
      i++;
    }
    if (i > 0 && i < key.length) {
      i--;
    }
    const section1 = key.slice(0, i);
    let section2 = key.slice(i);

    section2 = section2.replace(/\.?([A-Z]+)/g, function (x, y) {return '-' + y.toLowerCase()}).replace(/^_/, '');

    let result = section1.toLowerCase() + section2;
    if (result.charAt(0) === '-') {
      result = result.slice(1);
    }
    return result;
 }

  loadIndex() {
    const upperName = this.firstLetter.transform(this.name, true);
    const lowerName = this.firstLetter.transform(this.name, false);
    const fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity ? 'Entity' : 'DataTable'}`;
    const fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity ? 'Entity' : 'DataTable'}`;
    const snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    const snakeCase = this.camelToUnderscore(upperName);
    this.index =
      `import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ${fullNameLower}Adapter } from './${snakeCase}.reducer';
import { ${this.entity ? 'Entity' : 'DataTable'}State } from '../../reducers.index';

export const select${this.entity ? 'Entity' : 'DataTable'}ModuleState =
  createFeatureSelector<${this.entity ? 'Entity' : 'DataTable'}State>('${this.entity ? 'entities' : 'dataTables'}');
export const get${upperName}State =
  createSelector( select${this.entity ? 'Entity' : 'DataTable'}ModuleState, (s: ${this.entity ? 'Entity' : 'DataTable'}State) => s.${fullNameLower});
export const {
    selectIds: getIds,
    selectEntities: getEntities,
    selectAll: getAll,
    selectTotal: getTotal,
} = ${fullNameLower}Adapter.getSelectors(get${upperName}State);

export const get${upperName}ById = (id: string) => createSelector(getEntities, (entities) => entities[id]);${this.load ?
`
export const isLoading = createSelector(get${upperName}State, (s) => s.loading);
export const hasError = createSelector(get${upperName}State, (s) => s.error);` : ''}${this.save ?
`
export const saveSuccess = createSelector(get${upperName}State, (s) => s.saveSuccess);` : ''}

/**
 * Add Custom selectors here
 */
`;
  }

  loadActions() {
    const upperName = this.firstLetter.transform(this.name, true);
    const lowerName = this.firstLetter.transform(this.name, false);
    const fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity ? 'Entity' : 'DataTable'}`;
    const fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity ? 'Entity' : 'DataTable'}`;
    const snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    const snakeCase = this.camelToUnderscore(upperName);
    this.actionsTitle = `${snakeCase}.actions.ts`;
    this.actions = '';
    this.actions =
    `import { Action } from '@ngrx/store';
import { ${fullNameUpper} } from 'src/app/store/model/${snakeCaseFull}.model';
import { Info } from 'src/app/shared/model/info.model';

export enum ${upperName}ActionTypes {
    ${this.addAll ? `AddAll = '[${fullNameUpper}] Add All'` : `UpsertMany = '[${fullNameUpper}] Upsert Many'`},${this.load ?
      `
      Load = '[${fullNameUpper}] Load',
      LoadSuccess = '[${fullNameUpper}] Load Success',
      LoadFail = '[${fullNameUpper}] Load Fail',` :
      ''}${this.save ?
      `
      Save = '[${fullNameUpper}] Save',
      SaveSuccess = '[${fullNameUpper}] Save Success',
      SaveFail = '[${fullNameUpper}] Save Fail',` :
      ''}${this.delete ?
      `
      Delete = '[${fullNameUpper}] Delete',
      DeleteSuccess = '[${fullNameUpper}] Delete Success',
      DeleteFail = '[${fullNameUpper}] Delete Fail',` : ''}
}

export class ${this.addAll ? 'AddAll' : 'UpsertMany'} implements Action {
  readonly type = ${upperName}ActionTypes.${this.addAll ? 'AddAll' : 'UpsertMany'};
  constructor(public cargo: Info<${fullNameUpper}>[]) {}
}
${this.load ?
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
` :
  ''
}${this.save ?
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
  ` :
  ''
}${this.delete ?
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
  ` :
  ''
}
export type ${upperName}Actions =${this.load ?
    `
    | Load
    | LoadSuccess
    | LoadFail` :
    ''
    }${this.save ?
    `
    | Save
    | SaveSuccess
    | SaveFail` :
    ''
    }${this.delete ?
    `
    | Delete
    | DeleteSuccess
    | DeleteFail` :
    ''
    }
    | ${this.addAll ? 'AddAll' : 'UpsertMany'};
`;
  }

  loadReducer() {
    const upperName = this.firstLetter.transform(this.name, true);
    const lowerName = this.firstLetter.transform(this.name, false);
    const fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity ? 'Entity' : 'DataTable'}`;
    const fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity ? 'Entity' : 'DataTable'}`;
    const snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    const snakeCase = this.camelToUnderscore(upperName);
    this.reducerTitle = `${snakeCase}.reducer.ts`;
    this.reducerIndex1 = `${fullNameLower}: ${fullNameUpper}State;`;
    this.reducerIndex2 = `${fullNameLower}: ${fullNameLower}Reducer,`;
    this.reducer =
    `import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ${upperName}Actions, ${upperName}ActionTypes } from './${snakeCase}.actions';
import { ${fullNameUpper} } from 'src/app/store/model/${snakeCaseFull}.model';
import { Info } from 'src/app/shared/model/info.model';

export interface ${fullNameUpper}State extends EntityState<Info<${fullNameUpper}>> {${this.load ?
      `
      loading: boolean;
      error: boolean;` : ''}${this.save ?
      `
      saveSuccess: boolean;` : ''}${this.delete ?
      `
      deleteSuccess: boolean;` : ''}
}

export const ${fullNameLower}Adapter = createEntityAdapter<Info<${fullNameUpper}>>();

const default${upperName} = {${this.load ?
  `
  loading: false,
  error: null,` : ''}${this.save ?
  `
  saveSuccess: false,` : ''}${this.delete ?
  `
  deleteSuccess: false,` : ''}
};

export const initialState: ${fullNameUpper}State =
  ${fullNameLower}Adapter.getInitialState(default${upperName});

export function ${fullNameLower}Reducer(
    state: ${fullNameUpper}State = initialState,
    action: ${upperName}Actions) {
    switch (action.type) {${this.load ? `
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
            };` : ''}${this.save ? `
        case ${upperName}ActionTypes.Save:
            return {
                ...state,
                saveSuccess: false
            };
        case ${upperName}ActionTypes.SaveSuccess:
            return {
                ...state,
                saveSuccess: true
            };` : ''}${this.delete ? `
        case ${upperName}ActionTypes.DeleteSuccess:
            return ${fullNameLower}Adapter.removeOne(action.cargo, {...state});` : ''}
        case ${upperName}ActionTypes.${this.addAll ? 'AddAll' : 'UpsertMany'}:
            return ${fullNameLower}Adapter.${this.addAll ? 'addAll' : 'upsertMany'}(action.cargo, {...state});
        default:
            return state;
    }
}
`;
  }

  loadEffects() {
    const upperName = this.firstLetter.transform(this.name, true);
    const lowerName = this.firstLetter.transform(this.name, false);
    const fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity ? 'Entity' : 'DataTable'}`;
    const fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity ? 'Entity' : 'DataTable'}`;
    const snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    const snakeCase = this.camelToUnderscore(upperName);
    this.effectsTitle = `${snakeCase}.effects.ts`;
    if (!this.load && !this.save && !this.delete) {
      this.effects = '//No effects needed';
      return;
    }
    this.effectsIndex = `${upperName}Effects,`;
    this.effects =
    `import { Injectable } from '@angular/core';
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
    constructor(
        private actions$: Actions,
        private ${lowerName}DataService: ${upperName}DataService) { }${this.load ? `

    @Effect()
    load${upperName}$: Observable<Action> = this.actions$.pipe(
        ofType(${upperName}ActionTypes.Load),
        mergeMap(() => this.${lowerName}DataService.load${upperName}s().pipe(
                map((result: boolean) => result ? new ${lowerName}Actions.LoadSuccess() : new ${lowerName}Actions.LoadFail())
            )
        )
    );` : ''}${this.save ? `

    @Effect()
    save${upperName}$: Observable<Action> = this.actions$.pipe(
        ofType(${upperName}ActionTypes.Save),
        mergeMap((action: ${lowerName}Actions.Save) => this.${lowerName}DataService.save${upperName}(action.cargo).pipe(
                map((result: boolean) => result ? new ${lowerName}Actions.SaveSuccess()  : new ${lowerName}Actions.SaveFail())
            )
        )
    );` : ''}${this.delete ? `

    @Effect()
    delete${upperName}$: Observable<Action> = this.actions$.pipe(
        ofType(${upperName}ActionTypes.Delete),
        mergeMap((action: ${lowerName}Actions.Delete) => this.${lowerName}DataService.delete${upperName}(action.cargo).pipe(
                map((result: boolean)  => result ? new ${lowerName}Actions.DeleteSuccess(action.cargo) : new ${lowerName}Actions.DeleteFail())
            )
        )
    );` : ''}

}
`;
  }

  loadService() {
    const upperName = this.firstLetter.transform(this.name, true);
    const lowerName = this.firstLetter.transform(this.name, false);
    const fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity ? 'Entity' : 'DataTable'}`;
    const fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity ? 'Entity' : 'DataTable'}`;
    const snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    const snakeCase = this.camelToUnderscore(upperName);
    this.serviceTitle = `${snakeCase}.service.ts`;
    this.dataParser = `private parse${fullNameUpper}(payload: any) {
  this.${fullNameLower}Store.dispatch(new ${fullNameLower}Actions.${this.addAll ? 'AddAll' : 'UpsertMany'}(this.parseData(payload)));
}`;
    this.dataParserActionImport =
    `import * as ${fullNameLower}Actions from './${this.entity ? 'entity' : 'data-table'}/${snakeCase}/${snakeCase}.actions';`;
    this.dataParserConstructor = `private ${fullNameLower}Store: Store<${fullNameUpper}State>,`;
    if (!this.load && !this.save && !this.delete) {
      this.service = '//No service needed';
      return;
    }
    this.storeModule = `${upperName}DataService,`;
    this.service =
    `import { Injectable } from '@angular/core';
import { DataService } from 'src/app/core/service/data.service';
import { Observable, AsyncSubject } from 'rxjs';
import { Transaction } from 'src/app/shared/model/transaction.model';
import { Message } from 'src/app/shared/model/message.model';
import { NotificationService } from 'src/app/core/service/notification.service';${this.save ? `}
import { ${fullNameUpper} } from 'src/app/store/model/${snakeCaseFull}.model';` : ''}
import { DataParserService } from 'src/app/store/data-parser.service';

@Injectable()
export class ${upperName}DataService {

    constructor(
        private dataService: DataService,
        private dataParserService: DataParserService,
        private notificationService: NotificationService
    ) { }${this.load ? `

    public load${upperName}s(): Observable<boolean> {
        const result = new AsyncSubject<boolean>();
        const transaction = new Transaction();
        // transaction.addOperation('TecNet${upperName}');

        const sub = this.dataService.postTransaction(transaction).subscribe(
            (msg: Message) => {

                result.next(msg.Success);
                result.complete();
                sub.unsubscribe();

                if (!msg.Success) {
                    this.notificationService.popError(msg.Msg, 'Error loading ${upperName}s', msg.InternalMsg);
                    return;
                }

                this.dataParserService.parse(msg);

            }
        );

        return result;
    }` : ''}${this.save ? `

    public save${upperName}(${lowerName}: ${fullNameUpper}): Observable<boolean> {
        const result = new AsyncSubject<boolean>();
        this.notificationService.popAction('Attempting to save ${lowerName}');

        const transaction = new Transaction();
        // transaction.addOperation('TecNet${upperName}').addAction('SaveTecNet${upperName}', ${lowerName}.${upperName}_ID, JSON.stringify(${lowerName}));

        const sub = this.dataService.postTransaction(transaction).subscribe(
            (msg: Message) => {

                result.next(msg.Success);
                result.complete();
                sub.unsubscribe();

                if (!msg.Success) {
                    this.notificationService.popError(msg.Msg, 'Error saving ${upperName}', msg.InternalMsg);
                    return;
                } else {
                    this.notificationService.popSuccess('', 'Successfully saved ${upperName}');
                }

                this.dataParserService.parse(msg);
            }
        );

        return result;
    }` : ''}${this.delete ? `

    public delete${upperName}(id: string): Observable<boolean> {
        const result = new AsyncSubject<boolean>();
        this.notificationService.popAction('Attempting to delete ${lowerName}');

        const transaction = new Transaction('');
        // transaction.addOperation('TecNet${upperName}').addAction('DeleteTecNet${upperName}', id, id);

        const sub = this.dataService.postTransaction(transaction).subscribe(
            (msg: Message) => {

                result.next(msg.Success);
                result.complete();
                sub.unsubscribe();

                if (!msg.Success) {
                    this.notificationService.popError(msg.Msg, 'Error deleting ${upperName}', msg.InternalMsg);
                    return;
                } else {
                    this.notificationService.popSuccess('', 'Successfully deleted ${upperName}');
                }

                this.dataParserService.parse(msg);
            }
        );

        return result;
    }` : ''}

}
`;
  }

  loadModel() {
    const upperName = this.firstLetter.transform(this.name, true);
    const lowerName = this.firstLetter.transform(this.name, false);
    const fullNameUpper = `${this.firstLetter.transform(this.name, true)}${this.entity ? 'Entity' : 'DataTable'}`;
    const fullNameLower = `${this.firstLetter.transform(this.name, false)}${this.entity ? 'Entity' : 'DataTable'}`;
    const snakeCaseFull = this.camelToUnderscore(fullNameUpper);
    const snakeCase = this.camelToUnderscore(upperName);
    this.modelTitle = `${snakeCaseFull}.model.ts`;
    this.model =
    `export class ${fullNameUpper} {
  $id: string;
  $type: string;
  // Add properties here
}
`;
  }

}
