export class storeSettings {
    entity: boolean = true;
    name: string = '';

    //addAll or UpsertMany
    upsertMany: boolean = true;
    addAll: boolean = false;

    load: boolean = false;
    save: boolean = false;
    delete: boolean = false;
}