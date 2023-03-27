import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  droppedData = [
    'foo',
    '',
    '',
    ''
  ]

  taskForm = new FormGroup({
    title: new FormControl(null,Validators.required),
    description: new FormControl(null)
  });
  

  onDrop({ dropData }: any, id: number): void {
    for(let i = 0; i < this.droppedData.length; i++){
      this.droppedData[i] = '';
    }

    this.droppedData[id] = dropData;
  }

  // modal and alerts
  open(content) {
    this.taskForm.reset(); 
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      
    }, (reason) => {
      if(reason){
      
        this.toastr.success(`User ${reason} created successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
      }
    });
  }

  onSubmit(){
   
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.modalService.dismissAll()
      this.toastr.warning('hello', 'Warning', { timeOut: 3000, closeButton: true});
    }

  }

  // onDrop2({ dropData }: any): void {
  //   this.droppedData2 = dropData;
  //   setTimeout(() => {
  //     this.droppedData2 = '';
  //   }, 2000);
  // }


}
