import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/models/client.model';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(private clientService: ClientService, private router: Router, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getClients();
  }

  clientsList: any;

  titleModal: any;

  show = false;

  getClients() {
    this.clientService.getClients().subscribe((res) => {
      this.clientService.clientsList = res.data;
      this.clientsList = this.clientService.clientsList;
    })
  }

  clientForm = new FormGroup({
    name: new FormControl(''),
    vat_number: new FormControl(''),
    business_name: new FormControl(''),
    representatives: new FormControl(''),
    logo: new FormControl(''),
  });

  addClient() {
    console.log(this.clientForm.value);
    const newClient = this.clientForm.value;
    this.clientService.addClient(newClient.name, newClient.vat_number, newClient.business_name, newClient.representatives, newClient.logo)
      .subscribe(() => {
        this.clientForm.setValue({
          name: '',
          vat_number: '',
          business_name: '',
          representatives: '',
          logo: '',
        });
        this.getClients();
        this.successAddClient();
      });
  }

  editClient(id: any, content: any) {
    this.clientService.currentClient = id;
    this.openModalEditClient(id, content);
  }

  deleteClient(id: any, name: any, content: any) {
    this.currentDeleteClient = name;
    this.confirm(id, content);
  }

  currentDeleteClient: any;

  confirm(id: any, content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(() => {
        this.clientService.deleteClient(id).subscribe(() => {
          this.successDeleteClient();
          this.getClients();
        });
      }, () => {
        console.log('annullato');
      });
  }

  successDeleteClient() {
    this.toastr.success('Operazione riuscita!', 'Rimosso cliente', { timeOut: 3000 });
  }

  successAddClient() {
    this.toastr.success('Operazione riuscita!', 'Aggiunto cliente', { timeOut: 3000 });
  }

  openModalAddClient(content: any) {
    this.titleModal = "Aggiungi Cliente";
    this.clientForm.setValue({
      name: '',
      vat_number: '',
      business_name: '',
      representatives: '',
      logo: '',
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        this.addClient();
      }, () => {
        console.log('annullato');
      });
  }

  client: Client;

  openModalEditClient(id: any, content: any) {
    this.titleModal = "Modifica Cliente";
    this.clientService.getClient(id).subscribe((res) => {
      this.client = res.data;

      this.clientForm.setValue({
        name: this.client.name,
        vat_number: this.client.vat_number,
        business_name: this.client.business_name,
        representatives: this.client.representatives,
        logo: this.client.logo,
      });
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        const client = this.clientForm.value;
        this.clientService.updateClient(client.name, client.vat_number, client.business_name, client.representatives, client.logo)
          .subscribe(() => {
            console.log('ok');
            this.toastr.success('Operazione riuscita!', 'Modificato cliente', { timeOut: 3000 });
            this.getClients();
            this.show = false;
          })
      }, () => {
        console.log('annullato');
      });
  }
}
