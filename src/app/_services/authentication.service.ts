import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiUrl : string = `http://localhost:5000`

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email, password) {
        console.log("try login");
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
            .pipe(map(user => {
                console.log("posted");
                console.log(user);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log("return from login");
                return user;
            }));
    }

    signup(email, password, firstname, lastname) {
        console.log("try signup");
        return this.http.post<any>(`${this.apiUrl}/signup`, { email, password,firstname, lastname })
            .pipe(map(user => {
                console.log(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log("return from signup");
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    delete_account(userid) {
        console.log("try delete account");
        return this.http.post<any>(`${this.apiUrl}/delete_account`, {userid})
            .pipe(map(user => {
                console.log(user);
                this.currentUserSubject.next(null);
                console.log("return from delete account");
                return user;
            }));
    }
}