import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Sprint } from 'src/app/models/sprint.model';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project/project.service';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';
@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {

  constructor(
    private inter:ReqInterceptInterceptor,
    private sprintService: SprintService, 
    private modalService: NgbModal, 
    private projectService: ProjectService) { }

  ngOnInit(): void {
    // recupera tutti gli sprint del progetto
    this.currentSprintsIds = this.project.sprint_ids;
    this.role = this.inter.takeRole().role
    if (this.inter.takeRole().role !== 1) {
      this.getUserSprint()
    }else{

      this.getSprints();
    }

  }

  @Input() project: Project;

  role:number

  allSprints: Sprint[];
  currentSprintsIds: number[];
  currentSprints: Sprint[];
  titleModal: string;
  sprint: Sprint;

  sprintForm = new FormGroup({
    name: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    effort_days: new FormControl(''),
    revenue: new FormControl(''),
  });

  // recupera tutti i sprint e li filtra per progetto
  getSprints() {
    this.sprintService.getSprints().subscribe((res) => {
      this.allSprints = res.data;
      this.currentSprints = this.allSprints.filter((sprint) => {
        if (this.currentSprintsIds.includes(sprint.id)) {
          return true;
        } else {
          return false;
        }
      });
    });
  }

  // get sprint utente no admin
  getUserSprint(){

      this.sprintService.getUserSprint(this.project.id).subscribe((res)=>{

        this.currentSprints = res.data
        
      })
      
      
  }

  // apre la modale per aggiungere un nuovo sprint
  openModalAddSprint(content: any) {
    this.titleModal = "Aggiungi Sprint";
    this.sprintForm.setValue({
      name: '',
      start_date: '',
      end_date: '',
      effort_days: '',
      revenue: '',
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        console.log('ok');
      }, () => {
        console.log('annullato');
      });
  }

  // aggiunge un nuovo sprint al progetto
  addSprint() {
    if (this.sprintForm.status == 'INVALID') {
      this.projectService.warningBar('Tutti i campi sono obbligatori');
    } else {
      const newSprint = this.sprintForm.value;
      this.sprintService.addSprint(newSprint.name, newSprint.start_date, newSprint.end_date, newSprint.effort_days, newSprint.revenue, this.project.id)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.sprintForm.setValue({
            name: '',
            start_date: '',
            end_date: '',
            effort_days: '',
            revenue: '',
          });

          this.projectService.getProject(this.project.id).subscribe((res) => {
            this.currentSprintsIds = res.data.sprint_ids;
            if (this.inter.takeRole().role !== 1){
              this.getUserSprint()
            }else{

              this.getSprints();
            }
          });
          this.projectService.successBar('Sprint aggiunto con successo!');
        });
    }
  }

  // richiama la modale per modificare lo sprint
  openModalEditSprint(id: any, content: any) {
    this.sprintService.currentSprint = id;
    this.titleModal = "Modifica Sprint";
    this.sprintService.getSprint(id).subscribe((res) => {
      this.sprint = res.data;

      this.sprintForm.setValue({
        name: this.sprint.name,
        start_date: this.sprint.start_date,
        end_date: this.sprint.end_date,
        effort_days: this.sprint.effort_days,
        revenue: this.sprint.revenue,
      });
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        console.log('ok');
      }, () => {
        console.log('annullato');
      });
  }

  // modifica lo sprint selezionato
  editSprint() {
    if (this.sprintForm.status == 'INVALID') {
      this.projectService.warningBar('Tutti i campi sono obbligatori');
    } else {
      const sprint = this.sprintForm.value;
      this.sprintService.updateSprint(sprint.name, sprint.start_date, sprint.end_date, sprint.effort_days, sprint.revenue)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.projectService.successBar('Sprint modificato con successo!');
          this.projectService.getProject(this.project.id).subscribe((res) => {
            this.currentSprintsIds = res.data.sprint_ids;
            if (this.inter.takeRole().role !== 1){
              this.getUserSprint()
            }else{

              this.getSprints();
            }
          });
        });
    }
  }

  // cancella lo sprint selezionato
  deleteSprint(id: any, content: any) {
    this.confirm(id, content);
  }

  // richiama la modale per eliminare lo sprint
  confirm(id: any, content: any) {

    if (this.inter.takeRole().role !== 1) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(() => {

        this.getUserSprint()
        let sprint:any
        for (let i = 0; i < this.currentSprints.length; i++) {
          const e = this.currentSprints[i];
          
          if (e.id === id) {
            sprint = e
          }
        }

        if (sprint.tasks.length) {
          this.projectService.errorBar('Lo sprint non deve contenere task!');
          this.modalService.dismissAll();
        } else {
          this.sprintService.deleteSprint(id).subscribe(() => {
            this.projectService.successBar('Sprint eliminato!');
            this.modalService.dismissAll();
            this.projectService.getProject(this.project.id).subscribe((res) => {
              this.currentSprintsIds = res.data.sprint_ids;
              this.getUserSprint();
            });
          });
        }
      })


    } else {
      
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
        .result.then(() => {
          let sprints: Sprint[];
          let sprint: Sprint;
          this.sprintService.getSprints().subscribe((res) => {
            sprints = res.data;
            for (let i = 0; i < sprints.length; i++) {
              if (sprints[i].id == id) {
                sprint = sprints[i];
              }
            }
  
            if (sprint.task_ids.length) {
              this.projectService.errorBar('Lo sprint non deve contenere task!');
              this.modalService.dismissAll();
            } else {
              this.sprintService.deleteSprint(id).subscribe(() => {
                this.projectService.successBar('Sprint eliminato!');
                this.modalService.dismissAll();
              this.projectService.getProject(this.project.id).subscribe((res) => {
                  this.currentSprintsIds = res.data.sprint_ids;
                  this.getSprints();
                });
              });
            }
          });
        }, () => {
          console.log('annullato');
        });
      
    }
  }
}
