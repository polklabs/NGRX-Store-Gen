import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'firstLetter'})
export class FirstLetter implements PipeTransform {
    transform(value: string, uppercase: Boolean): any {
        if(uppercase){
            return value.charAt(0).toUpperCase() + value.slice(1);
        }else {
            return value.charAt(0).toLowerCase() + value.slice(1);
        }
    }
}