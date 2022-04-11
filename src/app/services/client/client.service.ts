import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../project/project.service';
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  user:any//user dal login
  constructor(private http: HttpClient,private projectService:ProjectService) {}

  clientsList: Client[];
  currentClient: any;
  url = environment.apiURL + '/clients';
  idClient:number // id passato al click per vedere i progetti associati

  
  // lista di tutti i clienti
  getClients(): Observable<any> {
    const url = this.url;
    return this.http.get(url);
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
    return this.http.post(url, body);
  }

  // retrieve cliente
  getClient(id: any): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
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
    return this.http.patch(url, body);
  }

  // cancella cliente
  deleteClient(id: any): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  // aggiorna immagine
  updateImage(image: any): Observable<any> {
    let url = environment.apiURL + '/uploadImage';

    const formData = new FormData()
    formData.append('image', image, image.name);
    return this.http.post(url, formData);
  }
}
