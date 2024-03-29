import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from 'src/app/models/client.model';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ProjectService } from 'src/app/services/project/project.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(private clientService: ClientService, private router: Router, private modalService: NgbModal,private toastr:ToastrService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.rounded = true
    this.cropperSettings.showCenterMarker = false
    this.cropperSettings.markerSizeMultiplier = 0.5
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
    },(err)=>{
      this.toastr.error(err.error)
    })
  }

  clientForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    vat_number: new FormControl(null, Validators.required),
    business_name: new FormControl(null, Validators.required),
    representatives: new FormControl(null),
  });

  // aggiunge un nuovo cliente
  addClient() {
    if (this.clientForm.status == 'INVALID') {
      this.toastr.warning('Name,P.iva and businness name are required');
      this.data.image = '';
      this.clientForm.value.logo_data = '';
    } else {
      
      const newClient = this.clientForm.value;
      this.clientService.addClient(newClient.name, newClient.vat_number, newClient.business_name, newClient.representatives, newClient.logo_data)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.data.image = '';
          this.getClients();
          this.toastr.success('Client added successfully')
        },(err)=>{
          this.toastr.error(err.error)
        });
    }
  }

  // modifica il cliente selezionato
  editClient() {
    if (this.clientForm.status == 'INVALID') {
      this.toastr.warning('Name,P.iva and businness name are required')
      this.data.image = `https://apps.h2app.it/overview-ws/${this.client.logo}?time=${new Date()}`;
    } else {
      const client = this.clientForm.value;
      this.clientService.updateClient(client.name, client.vat_number, client.business_name, client.representatives, client.logo_data)
        .subscribe((res) => {
          this.modalService.dismissAll();
          this.toastr.success('Client edited succefully');
          this.getClients();
        },(err)=>{
          this.toastr.error(err.error)
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
         this.toastr.success('Client deleted')
          this.getClients();
          this.modalService.dismissAll();
        });
      }, () => {
       
      });
  }

  // richiama la modale per aggiungere il cliente
  openModalAddClient(content: any) {
    this.titleModal = "Aggiungi Cliente";
    this.clientForm.reset();
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
        this.data.image = `https://apps.h2app.it/overview-ws/${this.client.logo}?time=${new Date()}`;
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
