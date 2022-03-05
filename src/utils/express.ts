import { User } from '../entity/User';
// custom_typings/express/index.d.ts
 declare namespace Express {
    export interface MyRequest {
         user?: User
    }
}
