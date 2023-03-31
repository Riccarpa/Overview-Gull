import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { TrelloService } from 'src/app/services/trello/trello.service';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private uService: UserService,
    private trService: TrelloService
  ) { }

  id = this.route.snapshot.paramMap.get('id');
  user: any;
  titleModal: string;
  isCreatingTask = false;

  tables = [
    {
      name: 'TO DO',
      color: 'background-color: gold',
      tasks: [
        {
          title: 'Fare la spesa', 
          description: 'Some quick example text to build on the card title and make up the bulk of the card\'s content', 
          checkList: [],
          isDragging: false
        },
        {
          title: 'Task 1', 
          description: 'Some quick example text',
          checkList: [], 
          isDragging: false
        },
        {
          title: 'Task 20', 
          description: 'Build on the card title and make up the bulk of the card\'s content', 
          checkList: [],
          isDragging: false
        }
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
  dragOverCard = 0;

  ngOnInit(): void {
    this.uService.retrieveUser(this.id).subscribe((res: any) => {
      this.user = res.data;

    }, (error) => {
      this.toastr.error(error.error.message);
    })

    // this.trService.getUserTaskTables().subscribe((res: any) => {
    //   this.tables = res.data;     
    // }, (error) => {
    //   this.toastr.error(error.error.message);
    // })

  }
  
  taskForm = this.fb.group({
    title: [null, Validators.required],
    description: [null],
    newCheckbox: [null],
    checklist: this.fb.array([])
  });

  get checklist(){
    return this.taskForm.controls["checklist"] as FormArray;
  }

  onDrop({dropData}: any, droppedTable: number): void {
    let data = dropData.split(',')
    let tableId = data[0];
    let taskId = data[1];

    //If card dropped on different table
    if(droppedTable != tableId){

      let task = this.tables[tableId].tasks.splice(taskId, 1);
      this.tables[droppedTable].tasks.push(task[0]);
    } else {

      //Swap card order
      let array = this.tables[tableId].tasks;
      array[this.dragOverCard] = array.splice(taskId, 1, array[this.dragOverCard])[0];
    }
    
  }

  //Give high z-index to current dragging task card
  onDragging(tableId : any, taskId : any){
    this.tables[tableId].tasks[taskId].isDragging = !this.tables[tableId].tasks[taskId].isDragging;
  }

  // modal and alerts
  openCreateTask(content, id : number) {
    this.isCreatingTask = true;
    this.taskForm.reset(); 
    this.checklist.clear();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    this.currentTable = id;
  }

  openEditTask(content, id : number, taskId : number){
    this.openCreateTask(content, id);
    this.isCreatingTask = false;

    this.taskForm.setValue({
      title: this.tables[id].tasks[taskId].title,
      description: this.tables[id].tasks[taskId].description,
      newCheckbox: null,
      checklist: []
    });

    let taskChecksArray = this.tables[id].tasks[taskId].checkList;
    for (let i = 0; i < taskChecksArray.length; i++) {

      const checkForm = this.fb.group({
        name: taskChecksArray[i].name,
        isChecked: taskChecksArray[i].name.isChecked
      })
      this.checklist.push(checkForm)
    }
  }

  saveTask(){
   
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.modalService.dismissAll()
      let checklist = [];
      for (let i = 0; i < this.checklist.controls.length; i++) {
        let checkControl = this.checklist.controls[i];
        checklist.push({
          name: checkControl.value.name,
          isChecked: checkControl.value.isChecked
        })
      }
      this.tables[this.currentTable].tasks.push({
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        checkList: checklist,
        isDragging: false
      })

      console.log(this.tables);
    
      this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
    }

  }

  addCheckbox(){
    console.log(this.taskForm.value.newCheckbox);
    const checkForm = this.fb.group({
      name: [this.taskForm.value.newCheckbox],
      isChecked: [false]
    })
    this.checklist.push(checkForm)
    console.log(this.taskForm.controls)

    /* this.personForm.setControl('nationality', this.formBuilder.control('', [Validators.required])); */ 
  }

  saveTasks(){
    // this.trService.saveTasks(this.tables,this.id).subscribe(res=>{
    //   this.toastr.success('Tasks saved.', 'Success!', {progressBar: true});
      
    // },(error)=>{
    //   this.toastr.error(error.error.message);
    // });
  }

  openTask(){
    
  }

}
