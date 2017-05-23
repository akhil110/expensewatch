import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class ExpenseService {
    
    public jwtToken: string;

    constructor(private http: Http) {
        const theUser:any = JSON.parse(localStorage.getItem('currentUser'));
        if (theUser) {
            this.jwtToken = theUser.token;
        }
    }
    
    saveExpense(userid, oExpense){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:1978/api/expense/${userid}`, JSON.stringify(oExpense), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getExpenses(userid, oExpense) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:1978/api/expense/report/${userid}`, JSON.stringify(oExpense), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getExpenseTotal(userid, oExpense) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:1978/api/expense/total/${userid}`, JSON.stringify(oExpense), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getExpense(expid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:1978/api/expense/${expid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    delExpense(expid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(`http://localhost:1978/api/expense/${expid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

     private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
