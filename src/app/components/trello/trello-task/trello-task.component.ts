import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { TrelloService } from 'src/app/services/trello/trello.service';

@Component({
  selector: 'app-trello-task',
  templateUrl: './trello-task.component.html',
  styleUrls: ['./trello-task.component.scss']
})
export class TrelloTaskComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private uService: UserService,
    private trService: TrelloService
  ) { }

  ngOnInit(): void {
  }

  isEditingTask = false;
  currentColumn = 0;
  currentTask : any;

  taskForm = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    status: [null],
    checkList: this.fb.array([]),
    files: this.fb.array([]),
    comments: this.fb.array([])
  });

  get checkList(){
    return this.taskForm.controls["checkList"] as FormArray;
  }

  get files(){
    return this.taskForm.controls["files"] as FormArray;
  }

  get comments(){
    return this.taskForm.controls["comments"] as FormArray;
  }

  openEditTask(content, id : number, taskId : number){
    this.taskForm.reset(); 
    this.checkList.clear();
    this.files.clear();
    this.comments.clear();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.isEditingTask = true;
    this.currentColumn = id;
    this.currentTask = taskId;

    // let checkboxArray = this.columns[id].tasks[taskId].checkList;
    // let filesArray = this.columns[id].tasks[taskId].files;
    // let commentsArray = this.columns[id].tasks[taskId].comments;

    // // Set taskForm values
    // this.taskForm.get('name').setValue(this.columns[id].tasks[taskId].name);
    // this.taskForm.get('description').setValue(this.columns[id].tasks[taskId].description);
    // this.taskForm.get('status').setValue(this.columns[id].tasks[taskId].status);
    // //taskForm Arrays
    // //Checklist
    // for (let i = 0; i < checkboxArray.length; i++) {
    //   const checkForm = this.fb.group({
    //     name: checkboxArray[i].name,
    //     isChecked: checkboxArray[i].isChecked
    //   })
    //   this.checkList.push(checkForm)
    // }
    // //Files
    // for (let i = 0; i < filesArray.length; i++) {
    //   const filesForm = this.fb.group({
    //     file: filesArray[i].file,
    //     url: filesArray[i].url
    //   })
    //   this.files.push(filesForm)
    // }
    // //Comments
    // for (let i = 0; i < commentsArray.length; i++) {
    //   const commentsForm = this.fb.group({
    //     message: commentsArray[i].text
    //   })
    //   this.comments.push(commentsForm)
    // }
    // console.log(commentsArray)
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
      //let checkArray = this.taskForm.get("checkList") as FormArray;
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

  // updateTask(){
  //   if(this.taskForm.status == 'INVALID'){
  //     this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
  //   }else{
  //     this.modalService.dismissAll()
  //     this.isEditingTask = false;
  //     let taskArray = this.columns[this.currentColumn].tasks;
  //     let formData = this.taskForm.getRawValue();
    
  //     taskArray.splice(this.currentTask, 1, formData);
  //     let task = taskArray[this.currentTask];
  //     task.checksCompleted = 0;

  //     for (let i = 0; i < task.checkList.length; i++) {
  //       if (task.checkList[i].isChecked) {
  //         task.checksCompleted += 1;
  //       }
  //     }   

  //     this.toastr.success(`Task updated successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
  //   }
  // }


}
