import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TrelloService } from 'src/app/services/trello/trello.service';
import { TaskService } from 'src/app/services/task/task.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { environment } from 'src/environments/environment';

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
    private trService: TrelloService,
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }

  colors = ['gold', 'yellowgreen', 'tomato', 'deepskyblue'];

  userId = parseInt(this.route.snapshot.paramMap.get('id'));
  isCreatingColumn = false;
  isEditingTask = false;
  currentDraggingElmnt: string;
  currentColumn = 0;
  dragOverCard = 0;
  dragOverColumn = 0;

  columns : any;
  
  taskForm = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    status: [null],
    checklist: this.fb.array([]),
    files: this.fb.array([]),
    comments: this.fb.array([]),
    assignee_id: [null],
    start_date: [null],
    end_date: [null],
    effort: [null],
    sprint_id: [null]
  });

  newColumnName = '';
  fileName = '';

  @ViewChildren('newElement', {read: ElementRef}) newElemInput: QueryList<ElementRef>;

  get checklist(){
    return this.taskForm.controls["checklist"] as FormArray;
  }
  get files(){
    return this.taskForm.controls["files"] as FormArray;
  }
  get comments(){
    return this.taskForm.controls["comments"] as FormArray;
  }

  ngOnInit(): void {
    this.trService.getUserTaskColumns(this.userId).subscribe((res: any) => {
      let data = res.data;
      let columnArray = [];

      for (let index = 0; index < data.length; index++) {
        let sprints = data[index].sprints;
        for (let i = 0; i < sprints.length; i++) {
          let sprint = sprints[i];
          sprint.projName = data[index].project.name;
          
          columnArray.push(sprint);
        } 
      }

      this.columns = columnArray;

      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i].color = `background-color: ${this.colors[i]}`;  

        for (let n = 0; n < this.columns[i].tasks.length; n++) {
          this.columns[i].tasks[n].description = ''; 
          this.columns[i].tasks[n].files = [];

          if(this.columns[i].tasks[n].checklist == null ){
            this.columns[i].tasks[n].checklist = [];
          } else {
            let checklist = JSON.parse(this.columns[i].tasks[n].checklist);
            this.columns[i].tasks[n].checklist = checklist;
          } 

          //User comment picture
          for (let index = 0; index < this.columns[i].tasks[n].comments.length; index++) {
            let user = this.columns[i].tasks[n].comments[index].user;
            if (user.picture && user.picture.includes('.png')) {
              user.picture = `${environment.apiURL2}/images/users/${this.columns[i].tasks[n].comments[index].user.id}.png?r=${this.projectService.randomNumber()}`
            } else {
              user.picture = `${environment.apiURL2}/images/users/${this.columns[i].tasks[n].comments[index].user.id}.jpg?r=${this.projectService.randomNumber()}`
            } 
          }
        }    
      }
      console.log(this.columns)
      
      //Checks completed
      for (let i = 0; i < this.columns.length; i++) {
        for (let n = 0; n < this.columns[i].tasks.length; n++) {
          let task = this.columns[i].tasks[n];
          task.checksCompleted = 0;
  
          for (let v = 0; v < task.checklist.length; v++) {
            if (task.checklist[v].isChecked) {
              task.checksCompleted += 1;
            }
          }   
        } 
      }
    }, (error) => {
      this.toastr.error(error.error.message);
    })
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
      }
    //If its a column
    } else if(this.currentDraggingElmnt == "column" && droppedOnColumn == null) {
      //Swap column order
      let array = this.columns;
      let columnId = dropData;
      let column = array.splice(columnId, 1)[0];

      array.splice(this.dragOverColumn, 0, column);
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
    this.taskService.currentTask = this.columns[id].tasks[taskId].id;

    let checkboxArray = this.columns[id].tasks[taskId].checklist;
    let filesArray = this.columns[id].tasks[taskId].files;
    let commentsArray = this.columns[id].tasks[taskId].comments;

    // Set taskForm values
    this.taskForm.setValue({
      name: this.columns[id].tasks[taskId].name,
      description: this.columns[id].tasks[taskId].description,
      status: this.columns[id].tasks[taskId].status,
      checklist: [],
      files: [],
      comments: [],
      assignee_id: this.columns[id].tasks[taskId].assignee_id,
      start_date: this.columns[id].tasks[taskId].start_date,
      end_date: this.columns[id].tasks[taskId].end_date,
      effort: this.columns[id].tasks[taskId].effort,
      sprint_id: this.columns[id].tasks[taskId].sprint_id
    })

    //taskForm Arrays
    //checklist
    for (let i = 0; i < checkboxArray.length; i++) {
      const checkForm = this.fb.group({
        name: checkboxArray[i].name,
        isChecked: checkboxArray[i].isChecked
      })
      this.checklist.push(checkForm)
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
            this.checklist.push(checkForm)  
          }  
        }
      } else {
        checkForm = this.fb.group({
          name: [string],
          isChecked: [false]
        })
        this.checklist.push(checkForm)
      }
    }
    input.value = '';
    input.style.height = '40px';
  }

  removeCheckbox(index : number){
    //let checkArray = this.taskForm.get("checklist") as FormArray;
    this.checklist.removeAt(index);
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

    if(input.value.length > 0){

      const content = input.value;
      this.taskService.postComment(this.taskService.currentTask, content).subscribe((res) => {
        this.projectService.successBar('Comment sent')

        const commentsForm = this.fb.group({
          id: res.data?.id,
          task_id: res.data?.task_id,
          user_id: res.data?.user_id,
          text: content,
          created_at: res.data?.created_at,
          user: {
            id: res.data?.user.id,
            name: res.data?.user.name,
            picture: res.data?.user.picture ? `${environment.apiURL2}/images/users/${res.data?.user.id}.png?r=${this.projectService.randomNumber()}` : `${environment.apiURL2}/images/users/${res.data?.user.id}.jpg?r=${this.projectService.randomNumber()}`,
          }
        })
        this.comments.push(commentsForm);

        this.ngOnInit()
      });
    }

    input.value = '';
    input.style.height = '40px';
  }

  changeStatus(status : any){
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
      this.columns.push(column);
      this.newColumnName = '';
    }
    
    this.toastr.success(`Column added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
  }

  addTask(columnId : number, input : any){
    const newTask = this.taskForm.value;
    this.taskService.addTask(input.value, this.userId, newTask.status, newTask.start_date, newTask.end_date, newTask.effort, columnId)
        .subscribe(() => {

          this.toastr.success(`Task added successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true });
          this.ngOnInit();
        });
  }

  updateTask(){
    if(this.taskForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      const uTask = this.taskForm.value;
      const checklist = this.checklist.getRawValue();
      const json = JSON.stringify(checklist);
      this.taskService.updateTask(uTask.name, uTask.assignee_id, uTask.status, uTask.start_date, uTask.end_date, uTask.effort, json)
        .subscribe(() => {
          this.isEditingTask = false;
          this.modalService.dismissAll();
          this.projectService.successBar('Task edited successfully');
          this.ngOnInit();
        });
    }
  }

  deleteElement(){
    this.modalService.dismissAll()

    if (!this.isEditingTask) {
      this.columns.splice(this.currentColumn, 1);
    } else {
      this.taskService.deleteTask(this.taskService.currentTask).subscribe(() => {
        this.projectService.successBar('Task deleted');
  
        this.ngOnInit()
        this.modalService.dismissAll();
      });
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
    this.checklist.clear();
    this.files.clear();
    this.comments.clear();
  }

}
