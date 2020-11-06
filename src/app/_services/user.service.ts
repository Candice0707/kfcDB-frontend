import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiUrl : string = `http://localhost:5000`

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    get_profile(userid) {
        console.log("try get userid");
        // return this.http.get<Hero>(url).pipe(
        //   tap(_ => this.log(`fetched hero id=${id}`)),
        //   catchError(this.handleError<Hero>(`getHero id=${id}`))
        // );
        const url = `${this.apiUrl}/${userid}`;
        return this.http.get<any>(url)
            .pipe(map(user => {
                console.log(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log("return from get_profile");
                return user;
            }));
      }
    update_profile(userid, firstname, lastname) {
        console.log("try update profile");
        return this.http.post<any>(`${this.apiUrl}/update_profile`, { userid, firstname,lastname })
            .pipe(map(user => {
                console.log(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log("return from update");
                return user;
            }));
    }
}