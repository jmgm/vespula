import { Dependencies } from './symbols';

export type ServiceId = string | symbol;

export interface InjectableClass {
    [Dependencies]?: ServiceId[];
}
