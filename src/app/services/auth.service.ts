import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { IUser } from '../models/users';
import { Observable, throwError } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class AuthService {
	public currentUser: IUser;
	constructor(
	private http: HttpClient,
	) { }

	buildHeader(): any {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
			})
		};
		return httpOptions;
	}

	isLoggedIn(): boolean {
		try {
			const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
			if (theUser) {
				this.currentUser = theUser.user;
			}
		} catch (e) {
			return false;
		}
		return !!this.currentUser;
	}

	login(oUser: any): Observable<any> {
		return this.http.post(`${environment.baseUrl}/api/login`, JSON.stringify(oUser), this.buildHeader()).pipe(
			tap((response: any) => {
				if (response.success) {
					this.currentUser = response.message as IUser;
					const userObj: any = {};
					userObj.user = response.message;
					userObj.token = response.token;

					localStorage.setItem('currentUser', JSON.stringify(userObj));
				}
			}),
			retry(3),
			catchError(this.handleError)
		);
	}

	logout(): void {
		this.currentUser = null;
		localStorage.removeItem('currentUser');
	}

	private handleError(err: any) {
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
