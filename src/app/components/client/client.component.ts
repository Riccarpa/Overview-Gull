import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {

  }

  clientsList: any;

  getClients() {
    this.clientService.getClients().subscribe((res) => {
      this.clientService.clientsList = res.data;
      this.clientsList = this.clientService.clientsList;
    })
  }

  showForm = false;

  clientForm = new FormGroup({
    name: new FormControl(''),
    vat_number: new FormControl(''),
    business_name: new FormControl(''),
    representatives: new FormControl(''),
  });

  onSubmit() {
    console.log(this.clientForm.value);
    const newClient = this.clientForm.value;
    this.clientService.addClient(newClient.name, newClient.vat_number, newClient.business_name, newClient.representatives)
      .subscribe(() => {
        console.log('ok');
      });
  }

  editClient(id: any) {
    this.clientService.currentClient = id;
    this.router.navigate(['client', id]);
  }

  deleteClient(id: any) {
    this.clientService.deleteClient(id).subscribe(() => {
      console.log('ok, eliminato');
      this.getClients();
    });
  }

}
