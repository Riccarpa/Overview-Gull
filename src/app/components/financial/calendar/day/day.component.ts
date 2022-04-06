import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  constructor() { }

  @Input() day : any
  @Input() activities :any
  ngOnInit(): void {
    
  }
  loadingButtons = [
    {
      name: 'secondary',
      loading: false,
    }
  ]
  showLoading(btn) {
    btn.loading = true;
    setTimeout(() => {
      btn.loading = false;
    }, 3000);
  }

}
