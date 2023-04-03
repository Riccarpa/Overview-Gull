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
  currentTable = 0;
  currentTask = 0;
  dragOverCard = 0;
  check = true;

  tables = [
    {
      name: 'TO DO',
      color: 'background-color: gold',
      tasks: [
        {
          title: 'Fare la spesa', 
          description: 'Some quick example text to build on the card title and make up the bulk of the card\'s content', 
          checkList: [{name: 'hello', isChecked: true}, {name: 'meee', isChecked: false}],
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

  trelloTable = this.fb.array([]);
  taskForm : any;
  // taskForm = this.fb.group({
  //   title: [null, Validators.required],
  //   description: [null],
  //   newCheckbox: [null],
  //   checklist: this.fb.array([])
  // });

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


    for (let i = 0; i < this.tables.length; i++) {

      let tableForm = this.fb.group({
        name: [this.tables[i].name],
        color: [this.tables[i].color],
        tasks: this.fb.array([])
      })

      for (let n = 0; n < this.tables[i].tasks.length; n++) {
        let task = this.tables[i].tasks[n];

        let taskForm = this.fb.group({
          title: [task.title, Validators.required],
          description: [task.description],
          isDragging: [false],
          newCheckbox: [null],
          checklist: this.fb.array([])
        });

        let taskControl = tableForm.get("tasks") as FormArray;

        for (let v = 0; v < task.checkList.length; v++) {
          const checkForm = this.fb.group({
            name: task.checkList[v].name,
            isChecked: task.checkList[v].isChecked
          })

          let checkControl = taskForm.get("checklist") as FormArray;
          checkControl.push(checkForm)
          
        }
        
        taskControl.push(taskForm);
      }

      this.trelloTable.push(tableForm);
    }
    //console.log(this.trelloTable.at(0))
  }
  
  // get checklist(){
  //   return this.taskForm.controls["checklist"] as FormArray;
  // }
  

  onDrop({dropData}: any, droppedTable: number): void {
    let data = dropData.split(',')
    let tableId = data[0];
    let taskId = data[1];

    let tables =this.trelloTable.getRawValue();
    let taskArray = this.trelloTable.at(tableId).get("tasks") as FormArray;
    let task = tables[tableId].tasks[taskId];

    let taskForm = this.fb.group({
      title: [task.title, Validators.required],
      description: [task.description],
      isDragging: [false],
      newCheckbox: [null],
      checklist: this.fb.array([])
    });

    taskArray.removeAt(taskId);

    //If card dropped on different table
    if(droppedTable != tableId){

      // let task = this.tables[tableId].tasks.splice(taskId, 1);
      // this.tables[droppedTable].tasks.push(task[0]);

      let dropInArray = this.trelloTable.at(droppedTable).get("tasks") as FormArray;
      dropInArray.push(taskForm);
      
    } else {
      //Swap card order
      // let array = this.tables[tableId].tasks;
      // array[this.dragOverCard] = array.splice(taskId, 1, array[this.dragOverCard])[0];

      taskArray.insert(this.dragOverCard, taskForm);
    }
  }

  //Give high z-index to current dragging task card
  onDragging(tableId : any, taskId : any){
    //this.tables[tableId].tasks[taskId].isDragging = !this.tables[tableId].tasks[taskId].isDragging;

    this.trelloTable.at(tableId).value.tasks.at(taskId).isDragging = !this.trelloTable.at(tableId).value.tasks.at(taskId).isDragging;
    //console.log(this.trelloTable.getRawValue())
  }

  // modal and alerts
  openCreateTask(content, id : number) {
    this.isCreatingTask = true;
    // this.taskForm.reset(); 
    // this.checklist.clear();
    this.taskForm = this.fb.group({
      title: [null, Validators.required],
      description: [null],
      isDragging: [false],
      newCheckbox: [null],
      checklist: this.fb.array([])
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    this.currentTable = id;
  }

  openEditTask(content, id : number, taskId : number){
    this.openCreateTask(content, id);
    this.isCreatingTask = false;

    this.currentTable = id;
    this.currentTask = taskId;

    let taskArray = this.trelloTable.at(id).get("tasks") as FormArray;
    let checkArray = taskArray.at(taskId).get("checklist") as FormArray;

    //let taskChecksArray = this.tables[id].tasks[taskId].checkList;
    // let taskChecksArray = this.trelloTable.at(id).value.tasks.at(taskId).checklist;
    
    // let checklist = []
    // for (let i = 0; i < taskChecksArray.length; i++) {

    //   const checkForm = this.fb.group({
    //     name: taskChecksArray[i].name,
    //     isChecked: taskChecksArray[i].isChecked
    //   })
    //   checklist.push(checkForm)
    // }

    this.taskForm.setValue({
      title: taskArray.at(taskId).value.title,
      description: taskArray.at(taskId).value.description,
      isDragging: [false],
      newCheckbox: [null],
      checklist: []
    });

    for (let i = 0; i < checkArray.length; i++) {
      this.taskForm.controls.checklist.push(checkArray.at(i))
    }

    console.log(this.taskForm)

  }

  saveTask(){
   
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.modalService.dismissAll()
      let taskArray = this.trelloTable.at(this.currentTable).get("tasks") as FormArray;
      if (this.isCreatingTask) {
    
        // this.tables[this.currentTable].tasks.push({
        //   title: this.taskForm.value.title,
        //   description: this.taskForm.value.description,
        //   checkList: [],
        //   isDragging: false
        // })

        taskArray.push(this.taskForm);
      
        this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
      } else {

        // let checklist = [];
        // let updatedTask;
        // for (let i = 0; i < this.checklist.controls.length; i++) {
        //   let checkControl = this.checklist.controls[i];
        //   checklist.push({
        //     name: checkControl.value.name,
        //     isChecked: checkControl.value.isChecked
        //   })
        // }

        // updatedTask = {
        //   title: this.taskForm.value.title,
        //   description: this.taskForm.value.description,
        //   checkList: checklist,
        //   isDragging: false
        // }
        // this.tables[this.currentTable].tasks.splice(this.currentTask, 1, updatedTask);
        taskArray.removeAt(this.currentTask);
        taskArray.insert(this.currentTask, this.taskForm);

        this.toastr.success(`Task updated successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
      }  
    }
  }

  addCheckbox(){
    let string = this.taskForm.value.newCheckbox

    if (string.length > 0) {
      let taskArray = this.trelloTable.at(this.currentTable).get("tasks") as FormArray;
      let checkArray = taskArray.at(this.currentTask).get("checklist") as FormArray;
      let checkForm;
      if (string.includes("\n")) {//If string has more lines, create a checkbox for each line
        let array = string.split("\n");

        for (let i = 0; i < array.length; i++) {
          checkForm = this.fb.group({
            name: [array[i]],
            isChecked: [false]
          })
          checkArray.push(checkForm)    
        }
      } else {
        checkForm = this.fb.group({
          name: [string],
          isChecked: [false]
        })
        checkArray.push(checkForm)
      }
      this.taskForm.setControl('newCheckbox', this.fb.control(''));
      console.log(checkArray)
    }
  }

  saveTasks(){
    // this.trService.saveTasks(this.tables,this.id).subscribe(res=>{
    //   this.toastr.success('Tasks saved.', 'Success!', {progressBar: true});
      
    // },(error)=>{
    //   this.toastr.error(error.error.message);
    // });
  }

}
