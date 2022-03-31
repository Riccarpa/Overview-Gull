import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  constructor(private fService:FinancialService,private uService:UserService,private route:ActivatedRoute,) { }
  id = this.route.snapshot.paramMap.get('id');
  user:any
  ngOnInit(): void {
    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
    })
  }
  

}
