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
    private inter: ReqInterceptInterceptor,
    private sprintService: SprintService,
    private modalService: NgbModal,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    // recupera tutti gli sprint del progetto
    this.currentSprintsIds = this.project.sprint_ids;
    this.getUserSprint();
  }

  @Input() project: Project;//projectpassato dal componente updateProject

  allSprints: Sprint[];
  currentSprintsIds: number[];
  currentSprints: Sprint[];
  titleModal: string;
  sprint: any;

  sprintForm = new FormGroup({
    name: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    effort_days: new FormControl(''),
    revenue: new FormControl(''),
  });

  // get project's sprints + tasks 
  getUserSprint() {
    this.sprintService.getUserSprint(this.project.id).subscribe((res) => {
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
          this.getUserSprint()
          this.projectService.successBar('Sprint aggiunto con successo!');
        });
    }
  }

  // richiama la modale per modificare lo sprint
  openModalEditSprint(id: any, content: any) {

    this.titleModal = "Modifica Sprint";
    
     
      for (let i = 0; i < this.currentSprints.length; i++) {
        let currentSprint = this.currentSprints[i];
        if (currentSprint.id === id) {
          this.sprint = currentSprint
        }
      }

      this.sprintForm.setValue({
        name: this.sprint.name,
        start_date: this.sprint.start_date,
        end_date: this.sprint.end_date,
        effort_days: this.sprint.effort_days,
        revenue: this.sprint.revenue,
      });
    

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
      this.sprintService.updateSprint(sprint.name, sprint.start_date, sprint.end_date, sprint.effort_days, sprint.revenue, this.sprint.id)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.projectService.successBar('Sprint modificato con successo!');
          this.getUserSprint()
        });
    }
  }

  // richiama la modale per eliminare lo sprint
  deleteSprint(id: any, content: any) {
    this.confirm(id, content);
  }
  
  // cancella lo sprint selezionato
  confirm(id: any, content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(() => {

        if (this.sprint.tasks.length) {
          this.projectService.errorBar('Lo sprint non deve contenere task!');
          this.modalService.dismissAll();
        } else {
          this.sprintService.deleteSprint(id).subscribe(() => {
            this.projectService.successBar('Sprint eliminato!');
            this.modalService.dismissAll();
            this.getUserSprint();
          });
        }
      })
  }
}
