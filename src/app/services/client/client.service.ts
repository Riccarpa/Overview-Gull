import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Client } from 'src/app/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  clientsList: Client[];
  token: any;
  currentClient: any;

  getClients(): Observable<any> {
    const url = 'http://80.211.57.191/api/clients';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  addClient(name: string, vat_number: string, business_name: string, representatives: string): Observable<any> {
    const url = 'http://80.211.57.191/api/clients';

    let body = {
      "name": name,
      "vat_number": vat_number,
      "business_name": business_name,
      "representatives": representatives,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(url, body, { headers: headers });
  }

  getClient(): Observable<any> {
    const url = `http://80.211.57.191/api/clients/${this.currentClient}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  updateClient(name: string, vat_number: string, business_name: string, representatives: string): Observable<any> {
    const url = `http://80.211.57.191/api/clients/${this.currentClient}`;

    let body = {
      "name": name,
      "vat_number": vat_number,
      "business_name": business_name,
      "representatives": representatives,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.patch(url, body, { headers: headers });
  }

  deleteClient(id: any): Observable<any> {
    const url = `http://80.211.57.191/api/clients/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.delete(url, { headers: headers });
  }
}
