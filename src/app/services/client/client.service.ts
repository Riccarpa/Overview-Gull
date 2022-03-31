import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Client } from 'src/app/models/client.model';
import { environment } from 'src/environments/environment';
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
  url = environment.apiURL + '/clients';
  idClient:number // id passato al click per vedere i progetti associati

  
  // lista di tutti i clienti
  getClients(): Observable<any> {
    const url = this.url;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  // aggiungi nuovo cliente
  addClient(name: string, vat_number: string, business_name: string, representatives: string, logo: string): Observable<any> {
    const url = this.url;

    let body = {
      "name": name,
      "vat_number": vat_number,
      "business_name": business_name,
      "representatives": representatives,
    };
    if (logo) {
      body['logo_path'] = logo;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(url, body, { headers: headers });
  }

  // retrieve cliente
  getClient(id: any): Observable<any> {
    const url = `${this.url}/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  // modifica cliente
  updateClient(name: string, vat_number: string, business_name: string, representatives: string, logo: string): Observable<any> {
    const url = `${this.url}/${this.currentClient}`;

    let body = {
      "name": name,
      "vat_number": vat_number,
      "business_name": business_name,
      "representatives": representatives,
    };
    if (logo) {
      body['logo_path'] = logo;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.patch(url, body, { headers: headers });
  }

  // cancella cliente
  deleteClient(id: any): Observable<any> {
    const url = `${this.url}/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.delete(url, { headers: headers });
  }

  // aggiorna immagine
  updateImage(image: any): Observable<any> {
    let url = environment.apiURL + '/uploadImage';

    const formData = new FormData()
    formData.append('image', image, image.name);
    const headers = {
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.post(url, formData, { headers: headers });
  }
}
