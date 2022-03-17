import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client/client.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  constructor(private clientService: ClientService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(!this.clientService.currentClient) {
      this.clientService.currentClient = this.route.snapshot.paramMap.get('id');
    }
    
    this.clientService.getClient().subscribe((res) => {
      this.client = res.data;

      this.clientForm.setValue({
        name: this.client.name,
        vat_number: this.client.vat_number,
        business_name: this.client.business_name,
        representatives: this.client.representatives,
      });
    })
  }

  client: Client;

  clientForm = new FormGroup({
    name: new FormControl(''),
    vat_number: new FormControl(''),
    business_name: new FormControl(''),
    representatives: new FormControl(''),
  });

  onSubmit() {
    console.log(this.clientForm.value);
    const client = this.clientForm.value;
    this.clientService.updateClient(client.name, client.vat_number, client.business_name, client.representatives)
      .subscribe(() => {
        console.log('ok');
      })
  }

}
