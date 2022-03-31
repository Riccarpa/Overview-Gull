import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Sprint } from 'src/app/models/sprint.model';
import { SprintService } from 'src/app/services/sprint/sprint.service';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {

  constructor(private sprintService: SprintService) { }

  ngOnInit(): void {
    this.currentSprintsIds = this.project.sprint_ids;

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

  @Input() project: Project;

  allSprints: Sprint[];
  currentSprintsIds: number[];
  currentSprints: Sprint[];
}
