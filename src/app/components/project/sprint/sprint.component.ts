import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Sprint } from 'src/app/models/sprint.model';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project/project.service';
@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {

  constructor(private sprintService: SprintService, private modalService: NgbModal, private projectService: ProjectService) { }

  ngOnInit(): void {
    // recupera tutti gli sprint del progetto
    this.currentSprintsIds = this.project.sprint_ids;
    this.getSprints();

  }

  @Input() project: Project;

  allSprints: Sprint[];
  currentSprintsIds: number[];
  currentSprints: Sprint[];
  titleModal: string;

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

          this.projectService.getUpdateProject().subscribe((res) => {
            this.currentSprintsIds = res.data.sprint_ids;
            this.getSprints();
          });
          this.projectService.successBar('Sprint aggiunto con successo!');
        });
    }
  }
}
