import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';


import { User } from '../_models';
import { Restaurant } from '../_models';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
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

    searchRestaurantByCategory(searchkey) {
        console.log("try get restaurants");
        return this.http.post<Restaurant[]>(`${this.apiUrl}/search`, {searchkey});
    }

    getRestaurantProfile(restaurant_id) {
        console.log("try get restaurant profile");
        const url = `${this.apiUrl}/get_restaurant/${restaurant_id}`;
        return this.http.get<any>(url);
    }

    getRestaurantTags(restaurant_id,length) {
        console.log("try get restaurant popular " + length + " tags");
        return this.http.post<any>(`${this.apiUrl}/get_restaurant_tags`, {restaurant_id, length});
    }

    tagRestaurant(customer_id, tag, restaurant_id) {
        console.log("try get tag restaurant");
        return this.http.post<any>(`${this.apiUrl}/tag_restaurant`, {customer_id, tag, restaurant_id});
    }
}