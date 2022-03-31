import { Component, OnInit } from '@angular/core';
import { FinancialService } from 'src/app/services/financial/financial.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  constructor(private fService:FinancialService) { }

  ngOnInit(): void {
  }
  

}
