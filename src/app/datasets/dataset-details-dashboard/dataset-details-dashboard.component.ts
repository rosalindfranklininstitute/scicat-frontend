import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Dataset, UserApi } from "shared/sdk";
import {
  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import {
  selectIsAdmin,
  selectIsLoading,
  selectIsLoggedIn,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable, combineLatest } from "rxjs";
import { map, pluck, takeWhile } from "rxjs/operators";
import { APP_CONFIG, AppConfig } from "app-config.module";
import {
  clearCurrentDatasetStateAction,
  fetchAttachmentsAction,
  fetchDatablocksAction,
  fetchDatasetAction, fetchOrigDatablocksAction,
} from "state-management/actions/datasets.actions";
import {
  clearLogbookAction,
  fetchLogbookAction,
} from "state-management/actions/logbooks.actions";
import { clearCurrentProposalStateAction, fetchProposalAction } from "state-management/actions/proposals.actions";
import { clearCurrentSampleStateAction, fetchSampleAction } from "state-management/actions/samples.actions";
import { MatDialog } from "@angular/material/dialog";


export interface JWT {
  jwt: string;
}

export interface FileObject {
  pid: string;
  files: string[];
}
enum TAB {
  details = "Details",
  datafiles =  "Datafiles",
  reduce =  "Reduce",
  logbook = "Logbook",
  attachments = "Attachments",
  admin = "Admin",
  lifecycle = "Lifecycle"
}
@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"],
})


export class DatasetDetailsDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  private subscriptions: Subscription[] = [];
  loading$ = this.store.select(selectIsLoading);
  loggedIn$ = this.store.select(selectIsLoggedIn);
  dataset$ = this.store.select(selectCurrentDataset);
  jwt$: Observable<JWT> = new Observable<JWT>();
  dataset: Dataset | undefined;
  navLinks: {
    location: string;
    label: string;
    icon: string;
    enabled: boolean;
  }[] = [];
  fetchDataActions: {[tab: string] : {action: any; loaded: boolean}} = {
    [TAB.details] : {action: fetchDatasetAction, loaded: false},
    [TAB.datafiles]: {action: fetchOrigDatablocksAction, loaded: false },
    [TAB.logbook]: {action: fetchLogbookAction, loaded: false },
    [TAB.attachments]: {action: fetchAttachmentsAction, loaded: false },
    [TAB.admin]: {action: fetchDatablocksAction, loaded: false },
  };
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : []))
  );

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store: Store,
    private userApi: UserApi,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.pipe(pluck("id")).subscribe((id: string) => {
      if (id) {
        // Fetch dataset details
        this.store.dispatch(fetchDatasetAction({pid: id}));
        this.fetchDataActions[TAB.details].loaded = true;
      }
    }).unsubscribe();
    this.dataset$.pipe(takeWhile(dataset => !dataset, true)).subscribe((dataset) => {
      if (dataset) {
        this.dataset = dataset;
        combineLatest([this.accessGroups$, this.isAdmin$, this.loggedIn$]).subscribe(
          ([groups, isAdmin, isLoggedIn]) => {
            const isInOwnerGroup = groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;
            this.navLinks = [
              { location: "./", label: TAB.details, icon: "menu", enabled: true },
              { location: "./datafiles", label: TAB.datafiles, icon: "cloud_download", enabled: true },
              { location: "./reduce", label: TAB.reduce, icon: "tune", enabled: this.appConfig.datasetReduceEnabled && isLoggedIn && isInOwnerGroup},
              { location: "./logbook", label: TAB.logbook, icon: "book", enabled: this.appConfig.logbookEnabled && isLoggedIn && isInOwnerGroup},
              { location: "./attachments", label: TAB.attachments, icon: "insert_photo", enabled: isLoggedIn && isInOwnerGroup},
              { location: "./lifecycle", label: TAB.lifecycle, icon: "loop", enabled: true},
              { location: "./admin", label: TAB.admin, icon: "settings", enabled: isLoggedIn && isAdmin}
            ];
          }
        ).unsubscribe();
        // fetch data for the selected tab
        this.route.firstChild?.url.subscribe((childUrl) => {
          const tab = childUrl.length === 1? childUrl[0].path : "details";
          this.fetchDataForTab(TAB[tab]);
        })
        .unsubscribe();

        if ("proposalId" in dataset) {
          this.store.dispatch(
            fetchProposalAction({ proposalId: dataset["proposalId"] })
          );
        } else {
          this.store.dispatch(clearLogbookAction());
        }
        if ("sampleId" in dataset) {
          this.store.dispatch(
            fetchSampleAction({ sampleId: dataset["sampleId"] })
          );
        }
      }
    });
    this.jwt$ = this.userApi.jwt();
  }
  onTabSelected(tab: string) {
    this.fetchDataForTab(tab);
  }
  fetchDataForTab(tab : string) {
    if (tab in this.fetchDataActions) {
      let args: {[key: string]: any};
      if (tab === TAB.logbook) {
        if (this.dataset && "proposalId" in this.dataset) {
          args = { name: this.dataset["proposalId"] };
        } else {
          return;
        }
      } else {
        args = {pid: this.dataset?.pid};
      }
      // load related data for selected tab
      switch(tab) {
        case TAB.details:{
          const {action, loaded} = this.fetchDataActions[TAB.attachments];
          if (!loaded) {
            this.store.dispatch(action(args));
            this.fetchDataActions[TAB.attachments].loaded = true;
          }
        }
        break;
        default: {
          const {action, loaded} = this.fetchDataActions[tab];
          if (!loaded) {
            this.fetchDataActions[tab].loaded = true;
            this.store.dispatch(action(args));
          }
        }
      }
    }
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.store.dispatch(clearCurrentDatasetStateAction());
    this.store.dispatch(clearCurrentProposalStateAction());
    this.store.dispatch(clearCurrentSampleStateAction());
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
