import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

import {throwError } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class ExpenseService {
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

	saveExpense(userid: string, oExpense: any) {
		return this.http.post(`http://localhost:1978/api/expense/${userid}`, JSON.stringify(oExpense), this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	getExpenses(userid: string, oExpense: any) {
		return this.http.post(`http://localhost:1978/api/expense/report/${userid}`, JSON.stringify(oExpense), this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	getExpenseTotal(userid: string, oExpense: any) {
		return this.http.post(`http://localhost:1978/api/expense/total/${userid}`, JSON.stringify(oExpense), this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	getExpense(expid: string) {
		return this.http.get(`http://localhost:1978/api/expense/${expid}`, this.buildHeader()).pipe(
			// tap(data => console.log('All: ' + JSON.stringify(data))),
			retry(3),
			catchError(this.handleError)
		);
	}

	delExpense(expid: string) {
		return this.http.delete(`http://localhost:1978/api/expense/${expid}`, this.buildHeader()).pipe(
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
