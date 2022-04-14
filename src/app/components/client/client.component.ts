import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from 'src/app/models/client.model';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ProjectService } from 'src/app/services/project/project.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(private clientService: ClientService, private router: Router, private modalService: NgbModal, private projectService: ProjectService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;

    this.data = {};
  }

  ngOnInit(): void {
    this.getClients();
    this.currentDate = new Date();
    this.clientService.idClient = null
  }

  clientsList: any;

  titleModal: any;

  currentDate: Date;

  url = environment.apiURL2;

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
    name: new FormControl('', Validators.required),
    vat_number: new FormControl('', Validators.required),
    business_name: new FormControl('', Validators.required),
    representatives: new FormControl('', Validators.required),
  });

  // aggiunge un nuovo cliente
  addClient() {
    if (this.clientForm.status == 'INVALID') {
      this.warningBar()
      this.data.image = '';
      this.clientForm.value.logo_data = '';
    } else {
      console.log(this.clientForm.value);
      const newClient = this.clientForm.value;
      this.clientService.addClient(newClient.name, newClient.vat_number, newClient.business_name, newClient.representatives, newClient.logo_data)
        .subscribe(() => {
          this.modalService.dismissAll();
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
  }

  // modifica il cliente selezionato
  editClient() {
    if (this.clientForm.status == 'INVALID') {
      this.warningBar();
      this.data.image = `http://80.211.57.191/overview_dev/${this.client.logo}?time=${new Date()}`;
    } else {
      const client = this.clientForm.value;
      this.clientService.updateClient(client.name, client.vat_number, client.business_name, client.representatives, client.logo_data)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.projectService.successBar('Cliente modificato con successo!');
          this.getClients();
        })
    }
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
       
      });
  }

  // alert
  successDeleteClient() {
    this.projectService.successBar('Cliente eliminato');
  }

  successAddClient() {
    this.projectService.successBar('Cliente aggiunto con successo!');
  }

  warningBar() {
    this.projectService.warningBar('Tutti i campi sono obbligatori');
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
       
      }, () => {
        
      });
  }

  client: Client;

  // richiama la modale per modificare il cliente
  openModalEditClient(id: any, content: any) {
    this.clientService.currentClient = id;
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
        this.data.image = `http://80.211.57.191/overview_dev/${this.client.logo}?time=${new Date()}`;
      } else {
        this.data.image = '';
      }
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
      
      }, () => {
       
      });
  }

  //  richiama la modale per aggiungere/modificare il logo del cliente
  openModalCropper(modal: any) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        this.clientService.updateImage(this.currentImage).subscribe((res) => {
          
          this.clientForm.value.logo_data = res.message;
        });
      }, () => {
     
      });
  }

  data: any;
  cropperSettings: CropperSettings;
  currentImage: any;

  fileChange(event: any) {
    let fileList = event.target.files;
    if (fileList.length > 0) {
      this.currentImage = fileList[0];
    }
  }


  // redirect to dashboard progetti associati
  goToDashboard(id:number){

    this.clientService.idClient = id
    this.router.navigate(['home/project'])
  }
}
