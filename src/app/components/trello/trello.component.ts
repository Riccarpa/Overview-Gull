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
  isCreatingTable = false;
  isEditingTitle = false;
  currentDraggingElmnt: string;
  currentTable = 0;
  currentTask = 0;
  dragOverCard = 0;
  dragOverTable = 0;

  tables : any;

  trelloTable = this.fb.array([]);
  
  taskForm = this.fb.group({
    title: [null, Validators.required],
    description: [null],
    checkList: this.fb.array([])
  });

  newTaskTitle = '';

  get checkList(){
    return this.taskForm.controls["checkList"] as FormArray;
  }

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

    this.tables = this.trService.getUserTaskTables()

    for (let i = 0; i < this.tables.length; i++) {
      for (let n = 0; n < this.tables[i].tasks.length; n++) {
        let task = this.tables[i].tasks[n];
        task.checksCompleted = 0;

        for (let v = 0; v < task.checkList.length; v++) {
          if (task.checkList[v].isChecked) {
            task.checksCompleted += 1;
          }
        }   
      } 
    }

    // for (let i = 0; i < this.tables.length; i++) {

    //   let tableForm = this.fb.group({
    //     name: [this.tables[i].name],
    //     color: [this.tables[i].color],
    //     tasks: this.fb.array([])
    //   })

    //   for (let n = 0; n < this.tables[i].tasks.length; n++) {
    //     let task = this.tables[i].tasks[n];

    //     let taskForm = this.fb.group({
    //       title: [task.title, Validators.required],
    //       description: [task.description],
    //       isDragging: [false],
    //       checkList: this.fb.array([])
    //     });

    //     let taskControl = tableForm.get("tasks") as FormArray;

    //     for (let v = 0; v < task.checkList.length; v++) {
    //       const checkForm = this.fb.group({
    //         name: task.checkList[v].name,
    //         isChecked: task.checkList[v].isChecked
    //       })

    //       let checkControl = taskForm.get("checkList") as FormArray;
    //       checkControl.push(checkForm) 
    //     }
    //     taskControl.push(taskForm);
    //   }
    //   this.trelloTable.push(tableForm);
    // }
  }

  onDrop({dropData}: any, droppedOnTable: number): void {
    // let taskArray = this.trelloTable.at(tableId).get("tasks") as FormArray;
    // let taskForm = taskArray.at(taskId)

    // taskArray.removeAt(taskId);

    // //If card dropped on different table
    // if(droppedTable != tableId){

    //   let dropInArray = this.trelloTable.at(droppedTable).get("tasks") as FormArray;
    //   dropInArray.push(taskForm);
      
    // } else {
    //   //Swap card order
    //   taskArray.insert(this.dragOverCard, taskForm);
    // }
    

    //If it's a task card
    if (this.currentDraggingElmnt == "task" && droppedOnTable != null) {
      let data = dropData.split(',')
      let tableId = data[0];
      let taskId = data[1];

      //If card dropped on different table
      if(droppedOnTable != tableId){
        let task = this.tables[tableId].tasks.splice(taskId, 1);
        this.tables[droppedOnTable].tasks.push(task[0]);

      } else {
        //Swap card order
        let array = this.tables[tableId].tasks;
        array[this.dragOverCard] = array.splice(taskId, 1, array[this.dragOverCard])[0];
      }
      //If its a table
    } else if(this.currentDraggingElmnt == "table" && droppedOnTable == null) {
      //Swap table order
      let array = this.tables;
      let taskId = dropData;
      array[this.dragOverTable] = array.splice(taskId, 1, array[this.dragOverTable])[0];
    }
    
  }

  //Give high z-index to current dragging element
  onDragging(tableId : any, taskId : any){
    if (taskId != null) {
      this.currentDraggingElmnt = "task";
      this.tables[tableId].tasks[taskId].isDragging = !this.tables[tableId].tasks[taskId].isDragging; 
    } else {
      this.currentDraggingElmnt = "table";
      this.tables[tableId].isDragging = !this.tables[tableId].isDragging; 
    }
  }

  // modal and alerts

  openEditTask(content, id : number, taskId : number){
    // let taskArray = this.trelloTable.at(id).get("tasks") as FormArray;
    // let checkArray = taskArray.at(taskId).get("checkList") as FormArray;

    // this.taskForm.setValue({
    //   title: taskArray.at(taskId).value.title,
    //   description: taskArray.at(taskId).value.description,
    //   isDragging: taskArray.at(taskId).value.isDragging,
    //   checkList: []
    // });

    // for (let i = 0; i < checkArray.length; i++) {
    //   this.taskForm.controls.checkList.push(checkArray.at(i))
    // }
    this.taskForm.reset(); 
    this.checkList.clear();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.isEditingTitle = false;

    this.currentTable = id;
    this.currentTask = taskId;

    let checkboxArray = this.tables[id].tasks[taskId].checkList;

    this.taskForm.setValue({
      title: this.tables[id].tasks[taskId].title,
      description: this.tables[id].tasks[taskId].description,
      checkList: []
    });

    for (let i = 0; i < checkboxArray.length; i++) {
      const checkForm = this.fb.group({
        name: checkboxArray[i].name,
        isChecked: checkboxArray[i].isChecked
      })
      this.checkList.push(checkForm)
    }
  }

  //Prevent press enter from creating new line and creating an empty checkbox with spacebar
  onKeydown(event, inputValue: any){
    if (event.code == 'Enter') {
      event.preventDefault();

    } else if(event.code == 'Space' && inputValue.length == 0){
      event.preventDefault();
    }
  }

  addCheckbox(input: any){
    let string = input.value

    if (string.length > 0) {
      let checkArray = this.taskForm.get("checkList") as FormArray;
      let checkForm;
      
      if (string.includes("\n")) {//If string has more lines, create a checkbox for each line
        let array = string.split("\n");

        for (let i = 0; i < array.length; i++) {
          if (array[i] != '') {
            checkForm = this.fb.group({
              name: [array[i]],
              isChecked: [false]
            })
            checkArray.push(checkForm)  
          }  
        }
      } else {
        checkForm = this.fb.group({
          name: [string],
          isChecked: [false]
        })
        checkArray.push(checkForm)
      }
    }
    input.value = '';
    input.style.height = '40px';
  }

  addTask(tableId : number){
    let taskArray = this.tables[tableId].tasks;
    this.tables[tableId].isCreatingTask = false;

    if (this.newTaskTitle != '') {
      this.taskForm.setValue({
        title: [this.newTaskTitle],
        description: [null],
        checkList: []
      });
  
      let formData = this.taskForm.getRawValue();
      taskArray.push(formData);
      this.newTaskTitle = '';
    }
    
    this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
  }

  updateTask(){
   
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.modalService.dismissAll()
      let taskArray = this.tables[this.currentTable].tasks;
      let formData = this.taskForm.getRawValue();
    
      taskArray.splice(this.currentTask, 1, formData);
      let task = taskArray[this.currentTask];
      task.checksCompleted = 0;

      for (let i = 0; i < task.checkList.length; i++) {
        if (task.checkList[i].isChecked) {
          task.checksCompleted += 1;
        }
      }   

      this.toastr.success(`Task updated successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
    }
  }


  saveBoard(){
    // this.trService.saveTasks(this.tables,this.id).subscribe(res=>{
    //   this.toastr.success('Tasks saved.', 'Success!', {progressBar: true});
      
    // },(error)=>{
    //   this.toastr.error(error.error.message);
    // });
  }

}
