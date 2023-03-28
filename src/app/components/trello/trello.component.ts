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

  tables = [
    {
      name: 'TO DO',
      color: 'background-color: gold',
      tasks: [
        {title: 'Fare la spesa', description: 'Some quick example text to build on the card title and make up the bulk of the card\'s content', isDragging: false},
        {title: 'Task 1', description: 'Some quick example text', isDragging: false},
        {title: 'Task 20', description: 'Build on the card title and make up the bulk of the card\'s content', isDragging: false}
      ]
    },
    {
      name: 'DOING',
      color: 'background-color: yellowgreen',
      tasks: []
    },
    {
      name: 'DONE',
      color: 'background-color: tomato',
      tasks: []
    },
    {
      name: 'IDEAS',
      color: 'background-color: deepskyblue',
      tasks: []
    }
  ];

  currentTable = 0;

  taskForm = new FormGroup({
    title: new FormControl(null,Validators.required),
    description: new FormControl(null)
  });
  

  onDrop({dropData}: any, droppedTable: number): void {
    let data = dropData.split(',')
    let tableId = data[0];
    let taskId = data[1];
    
    let task = this.tables[tableId].tasks.splice(taskId, 1);

    this.tables[droppedTable].tasks.push(task[0]);
    
    console.log(task[0])
    
  }

  onDrop2(){
    console.log('hello')
  }

  onDragging(isDragging : any){
    console.log(isDragging)
  }

  // modal and alerts
  open(content, id : number) {
    this.taskForm.reset(); 
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    this.currentTable = id;
  }

  onSubmit(){
   
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.modalService.dismissAll()
      this.tables[this.currentTable].tasks.push({
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        isDragging: false
      })
    
      this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
    }

  }

}
