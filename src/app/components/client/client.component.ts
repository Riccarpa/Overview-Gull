import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/models/client.model';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(private clientService: ClientService, private router: Router, private modalService: NgbModal, private toastr: ToastrService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;

    this.data = {};
  }

  ngOnInit(): void {
    this.getClients();
  }

  clientsList: any;

  titleModal: any;

  //genera lista di tutti i clienti 
  getClients() {
    this.clientService.getClients().subscribe((res) => {
      this.clientService.clientsList = res.data;
      this.clientsList = this.clientService.clientsList;
      for (let i = 0; i < this.clientsList.length; i++) {
        if (this.clientsList[i].logo) {
          this.clientsList[i].logo += `?time=${new Date()}`;
        }
      }
    })
  }

  clientForm = new FormGroup({
    name: new FormControl(''),
    vat_number: new FormControl(''),
    business_name: new FormControl(''),
    representatives: new FormControl(''),
  });

  // aggiunge un nuovo cliente
  addClient() {
    console.log(this.clientForm.value);
    const newClient = this.clientForm.value;
    this.clientService.addClient(newClient.name, newClient.vat_number, newClient.business_name, newClient.representatives, newClient.logo_data)
      .subscribe(() => {
        this.clientForm.setValue({
          name: '',
          vat_number: '',
          business_name: '',
          representatives: '',
        });
        this.data.image = '';
        this.getClients();
        this.successAddClient();
      });
  }

  // modifica il cliente selezionato
  editClient(id: any, content: any) {
    this.clientService.currentClient = id;
    this.openModalEditClient(id, content);
  }

  // cancella il cliente selezionato
  deleteClient(id: any, name: any, content: any) {
    this.currentDeleteClient = name;
    this.confirm(id, content);
  }

  currentDeleteClient: any;

  // richiama la modale per eliminare il cliente
  confirm(id: any, content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(() => {
        this.clientService.deleteClient(id).subscribe(() => {
          this.successDeleteClient();
          this.getClients();
          this.modalService.dismissAll();
        });
      }, () => {
        console.log('annullato');
      });
  }

  // alert
  successDeleteClient() {
    this.toastr.success('Operazione riuscita!', 'Rimosso cliente', { timeOut: 3000 });
  }

  successAddClient() {
    this.toastr.success('Operazione riuscita!', 'Aggiunto cliente', { timeOut: 3000 });
  }

  // richiama la modale per aggiungere il cliente
  openModalAddClient(content: any) {
    this.titleModal = "Aggiungi Cliente";
    this.clientForm.setValue({
      name: '',
      vat_number: '',
      business_name: '',
      representatives: '',
    });
    this.data.image = '';

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        this.addClient();
      }, () => {
        console.log('annullato');
      });
  }

  client: Client;

  // richiama la modale per modificare il cliente
  openModalEditClient(id: any, content: any) {
    this.titleModal = "Modifica Cliente";
    this.clientService.getClient(id).subscribe((res) => {
      this.client = res.data;

      this.clientForm.setValue({
        name: this.client.name,
        vat_number: this.client.vat_number,
        business_name: this.client.business_name,
        representatives: this.client.representatives,
      });
      if (this.client.logo) {
        this.data.image = `http://80.211.57.191/${this.client.logo}?time=${new Date()}`;
      } else {
        this.data.image = '';
      }
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        const client = this.clientForm.value;
        this.clientService.updateClient(client.name, client.vat_number, client.business_name, client.representatives, client.logo_data)
          .subscribe(() => {
            console.log('ok');
            this.toastr.success('Operazione riuscita!', 'Modificato cliente', { timeOut: 3000 });
            this.getClients();
          })
      }, () => {
        console.log('annullato');
      });
  }

  //  richiama la modale per aggiungere/modificare il logo del cliente
  openModalCropper(modal: any) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        console.log(this.data.image);
        if (this.data.image.includes('data:image/jpeg;base64,')) {
          let base64WithoutIndex = this.data.image.replace('data:image/jpeg;base64,', '');
          this.clientForm.value.logo_data = base64WithoutIndex;
        }
        else if (this.data.image.includes('data:image/png;base64,')) {
          let base64WithoutIndex = this.data.image.replace('data:image/png;base64,', '');
          this.clientForm.value.logo_data = base64WithoutIndex;
        }
        else {
          this.toastr.error('Inserisci immagine con formato valido', 'Formato non valido!', { timeOut: 3000 });
        }

      }, () => {
        console.log('Err!');
      });
  }

  data: any;
  cropperSettings: CropperSettings;
}
