import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import {throwError } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class UserService {
	public jwtToken: string;
	constructor(
		private http: HttpClient,
	) {
		const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
		if (theUser) {
			this.jwtToken = theUser.token;
		}
	}

	buildHeader(): any {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				Authorization: `${this.jwtToken}`
			})
		};
		return httpOptions;
	}

	register(oUser: any) {
		return this.http.post(`${environment.baseUrl}/register`, JSON.stringify(oUser), this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	getUser(userid: string) {
		return this.http.get(`${environment.baseUrl}/api/user/${userid}`, this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	updateUser(userid: string, oUser: any) {
		return this.http.put(`${environment.baseUrl}/api/user/${userid}`, JSON.stringify(oUser), this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	updatePassword(userid: string, oUser: any){
		return this.http.put(`${environment.baseUrl}/api/password/${userid}`, JSON.stringify(oUser), this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	private handleError(err) {
		let errorMessage = '';
		if (err.error instanceof Error) {
			errorMessage = `An error occurred: ${err.error.message}`;
		} else {
			errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
		}
		console.error(errorMessage);
		return throwError(errorMessage);
	}

}
