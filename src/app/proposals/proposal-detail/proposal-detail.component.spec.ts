import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProposalDetailComponent } from "./proposal-detail.component";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { APP_CONFIG } from "app-config.module";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgxJsonViewerModule } from "ngx-json-viewer";

describe("ProposalsDetailComponent", () => {
  let component: ProposalDetailComponent;
  let fixture: ComponentFixture<ProposalDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          MatButtonModule,
          MatCardModule,
          MatIconModule,
          NgxJsonViewerModule,
        ],
        declarations: [ProposalDetailComponent],
      });
      TestBed.overrideComponent(ProposalDetailComponent, {
        set: {
          providers: [{ provide: APP_CONFIG, useValue: { production: false } }],
        },
      });
      TestBed.compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
