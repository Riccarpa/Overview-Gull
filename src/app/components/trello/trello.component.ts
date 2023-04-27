import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { TrelloService } from 'src/app/services/trello/trello.service';
import { TaskService } from 'src/app/services/task/task.service';

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
    private trService: TrelloService,
    private taskService: TaskService
  ) { }

  colors = ['gold', 'yellowgreen', 'tomato', 'deepskyblue'];

  id = this.route.snapshot.paramMap.get('id');
  user: any;
  isCreatingColumn = false;
  isEditingTask = false;
  currentDraggingElmnt: string;
  currentColumn = 0;
  //currentTask : any;
  dragOverCard = 0;
  dragOverColumn = 0;

  columns : any;

  btnGroupModel = {
    left: true,
    middle: false,
    right: false
  };

  trelloColumn = this.fb.array([]);
  
  taskForm = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    status: [null],
    checkList: this.fb.array([]),
    files: this.fb.array([]),
    comments: this.fb.array([]),
    assignee_id: [null],
    start_date: [null],
    end_date: [null],
    effort: [null],
    sprint_id: [null]
  });

  newColumnName = '';
  newTaskTitle = '';
  fileName = '';

  //@ViewChild("newTask") newElemInput: ElementRef;

  @ViewChildren('newElement', {read: ElementRef}) newElemInput: QueryList<ElementRef>;

  get checkList(){
    return this.taskForm.controls["checkList"] as FormArray;
  }

  get files(){
    return this.taskForm.controls["files"] as FormArray;
  }

  get comments(){
    return this.taskForm.controls["comments"] as FormArray;
  }

  ngOnInit(): void {
    this.uService.retrieveUser(this.id).subscribe((res: any) => {
      this.user = res.data;
    }, (error) => {
      this.toastr.error(error.error.message);
    })

    this.trService.getUserTaskColumns().subscribe((res: any) => {
      console.log(res.data)

      this.columns = res.data[0].sprints;
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i].color = `background-color: ${this.colors[i]}`;  
        this.columns[i].tasks[0].description = ''; 
        this.columns[i].tasks[0].checkList = [];
        this.columns[i].tasks[0].files = [];

        for (let n = 0; n < this.columns[i].tasks.length; n++) {
          this.columns[i].tasks[n].description = ''; 
          this.columns[i].tasks[n].checkList = [];
          this.columns[i].tasks[n].files = [];
        }    
      }

      this.columns[0].tasks[0].checkList = [
        {name: 'uova', isChecked: true}, 
        {name: 'farina', isChecked: false},
        {name: 'burro', isChecked: false},
        {name: 'sedano', isChecked: false}
      ];
      
      for (let i = 0; i < this.columns.length; i++) {
        for (let n = 0; n < this.columns[i].tasks.length; n++) {
          let task = this.columns[i].tasks[n];
          task.checksCompleted = 0;
  
          for (let v = 0; v < task.checkList.length; v++) {
            if (task.checkList[v].isChecked) {
              task.checksCompleted += 1;
            }
          }   
        } 
      }

      console.log(this.columns)
    }, (error) => {
      this.toastr.error(error.error.message);
    })


    // for (let i = 0; i < this.columns.length; i++) {

    //   let columnForm = this.fb.group({
    //     name: [this.columns[i].name],
    //     color: [this.columns[i].color],
    //     tasks: this.fb.array([])
    //   })

    //   for (let n = 0; n < this.columns[i].tasks.length; n++) {
    //     let task = this.columns[i].tasks[n];

    //     let taskForm = this.fb.group({
    //       title: [task.title, Validators.required],
    //       description: [task.description],
    //       isDragging: [false],
    //       checkList: this.fb.array([])
    //     });

    //     let taskControl = columnForm.get("tasks") as FormArray;

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
    //   this.trelloColumn.push(columnForm);
    // }
  }

  //New column-task input focus
  ngAfterViewInit() {
    this.newElemInput.changes.subscribe(
      (next: QueryList<ElementRef>) => {
        if (next.first) {
          next.first.nativeElement.focus();
        } 
      }
    );
  }

  onDrop({dropData}: any, droppedOnColumn: number): void {
    //If it's a task card
    if (this.currentDraggingElmnt == "task" && droppedOnColumn != null) {
      let data = dropData.split(',')
      let columnId = data[0];
      let taskId = data[1];

      //If card dropped on different column
      if(droppedOnColumn != columnId){
        let task = this.columns[columnId].tasks.splice(taskId, 1);
        this.columns[droppedOnColumn].tasks.push(task[0]);

      } else {
        //Swap card order
        let array = this.columns[columnId].tasks;
        let card = array.splice(taskId, 1)[0];

        array.splice(this.dragOverCard, 0, card);
        //array[this.dragOverCard] = array.splice(taskId, 1, array[this.dragOverCard])[0];
      }
    //If its a column
    } else if(this.currentDraggingElmnt == "column" && droppedOnColumn == null) {
      //Swap column order
      let array = this.columns;
      let columnId = dropData;
      let column = array.splice(columnId, 1)[0];

      array.splice(this.dragOverColumn, 0, column);
      //array[this.dragOverColumn] = array.splice(columnId, 1, array[this.dragOverColumn])[0];
    }
  }

  //Give high z-index to current dragging element
  onDragging(columnId : any, taskId : any){
    if (taskId != null) {
      this.currentDraggingElmnt = "task";
      this.columns[columnId].tasks[taskId].isDragging = !this.columns[columnId].tasks[taskId].isDragging; 
    } else {
      this.currentDraggingElmnt = "column";
      this.columns[columnId].isDragging = !this.columns[columnId].isDragging; 
    }
  }

  openCreateTask(columnId : number){
    this.clearForm();
    this.newTaskTitle = "";
    this.columns[this.currentColumn].isCreatingTask = false;
    this.columns[columnId].isCreatingTask = true;
    this.currentColumn = columnId;
  }

  // modal and alerts
  openEditTask(content, id : number, taskId : number){
    this.clearForm();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.isEditingTask = true;
    this.currentColumn = id;
    this.taskService.currentTask = taskId;

    let checkboxArray = this.columns[id].tasks[taskId].checkList;
    let filesArray = this.columns[id].tasks[taskId].files;
    let commentsArray = this.columns[id].tasks[taskId].comments;

    // Set taskForm values
    this.taskForm.get('name').setValue(this.columns[id].tasks[taskId].name);
    this.taskForm.get('description').setValue(this.columns[id].tasks[taskId].description);
    this.taskForm.get('status').setValue(this.columns[id].tasks[taskId].status);
    //taskForm Arrays
    //Checklist
    for (let i = 0; i < checkboxArray.length; i++) {
      const checkForm = this.fb.group({
        name: checkboxArray[i].name,
        isChecked: checkboxArray[i].isChecked
      })
      this.checkList.push(checkForm)
    }
    //Files
    for (let i = 0; i < filesArray.length; i++) {
      const filesForm = this.fb.group({
        file: filesArray[i].file,
        url: filesArray[i].url
      })
      this.files.push(filesForm)
    }
    //Comments
    for (let i = 0; i < commentsArray.length; i++) {
      const commentsForm = this.fb.group({
        text: commentsArray[i].text,
        id: commentsArray[i].id,
        user_id: commentsArray[i].user_id,
        created_at: commentsArray[i].created_at,
        updated_at: commentsArray[i].updated_at,
        user: commentsArray[i].user
      })
      this.comments.push(commentsForm)
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
      let checkForm;
      
      if (string.includes("\n")) {//If string has more lines, create a checkbox for each line
        let array = string.split("\n");

        for (let i = 0; i < array.length; i++) {
          if (array[i] != '') {
            checkForm = this.fb.group({
              name: [array[i]],
              isChecked: [false]
            })
            this.checkList.push(checkForm)  
          }  
        }
      } else {
        checkForm = this.fb.group({
          name: [string],
          isChecked: [false]
        })
        this.checkList.push(checkForm)
      }
    }
    input.value = '';
    input.style.height = '40px';
  }

  removeCheckbox(index : number){
    //let checkArray = this.taskForm.get("checkList") as FormArray;
    this.checkList.removeAt(index);
  }

  onFileSelected(event : any){
    // this.fileName = event.target.files[0].name;
    let fileType = event.target.files[0].type;

    let fileForm = this.fb.group({
      //name: this.fileName
      file: event.target.files[0],
      url: null
    })

    if (fileType.includes("image/")) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        fileForm.get('url').setValue(event.target.result);
      }
    } 

    this.files.push(fileForm);
  }

  addComment(input: any){
    //Get user (userID)

    let commentsArray = this.columns[this.currentColumn].tasks[this.taskService.currentTask].comments;

    if(input.value.length > 0){
      const commentsForm = this.fb.group({
        text: input.value,
        id: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        user: commentsArray[0].user
      })
      this.comments.push(commentsForm);
    }

    input.value = '';
    input.style.height = '40px';
  }

  changeStatus(status : any){
    console.log(status);
    this.taskForm.get('status').setValue(status);
  }

  addColumn(){
    this.isCreatingColumn = false;

    if (this.newColumnName != '') {
      let column = {
        color: `background-color: ${ this.colors[Math.floor(Math.random() * 4)]}`,
        sprint: {
          name: this.newColumnName
        },
        tasks: []
      }
      
      //this.trService.addColumn(column);
      this.columns.push(column);
      this.newColumnName = '';
    }
    
    this.toastr.success(`Column added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
  }

  addTask(columnId : number, input : any){
    /* let taskArray = this.columns[columnId].tasks;
    this.columns[columnId].isCreatingTask = false;
    console.log('Before if')

    if (this.newTaskTitle != '') {
      this.taskForm.get('name').setValue(this.newTaskTitle);
  
      let formData = this.taskForm.getRawValue();
      //this.trService.addTask(formData, columnId);
      taskArray.push(formData);
      this.newTaskTitle = '';
      console.log(taskArray)

      this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
    }  */

    const newTask = this.taskForm.value;
    this.taskService.addTask(input.value, 154, newTask.status, newTask.start_date, newTask.end_date, newTask.effort, columnId)
        .subscribe(() => {

          this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
        });
  }

  updateTask(){
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.modalService.dismissAll()
      this.isEditingTask = false;
      let taskArray = this.columns[this.currentColumn].tasks;
      let formData = this.taskForm.getRawValue();
      console.log(formData)
    
      taskArray.splice(this.taskService.currentTask, 1, formData);
      let task = taskArray[this.taskService.currentTask];
      task.checksCompleted = 0;

      for (let i = 0; i < task.checkList.length; i++) {
        if (task.checkList[i].isChecked) {
          task.checksCompleted += 1;
        }
      }   

      this.toastr.success(`Task updated successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
    }
  }

  deleteElement(){
    // this.uService.deleteUser(this.id).subscribe(res=>{
    //   this.modalService.dismissAll()
    //   this.toastr.success('Profile deleted', 'Success!', {progressBar: true});
    // },(error)=>{
    //   this.toastr.error(error.error.message);
    // });
    this.modalService.dismissAll()

    if (!this.isEditingTask) {
      this.columns.splice(this.currentColumn, 1);
    } else {
      this.columns[this.currentColumn].tasks.splice(this.taskService.currentTask, 1);
    }
  }

  confirm(content, columnId : any) {
    if (columnId !== null) {
      this.currentColumn = columnId;
    }
    
    let confirmResut;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      confirmResut = `Closed with: ${result}`;
    }, (reason) => {
      confirmResut = `Dismissed with: ${reason}`;
    });
  }

  open(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      
    }, (reason) => { });
  }

  clearForm(){
    this.taskForm.reset(); 
    this.checkList.clear();
    this.files.clear();
    this.comments.clear();
  }

  saveBoard(){
    // this.trService.saveTasks(this.columns,this.id).subscribe(res=>{
    //   this.toastr.success('Tasks saved.', 'Success!', {progressBar: true});
      
    // },(error)=>{
    //   this.toastr.error(error.error.message);
    // });
  }

}
