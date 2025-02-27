import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  fetchProposalAction,
  fetchProposalDatasetsAction,
  changeDatasetsPageAction,
} from "state-management/actions/proposals.actions";
import {
  selectCurrentProposal,
  selectProposalDatasets,
  selectDatasetsPage,
  selectDatasetsCount,
  selectDatasetsPerPage,
} from "state-management/selectors/proposals.selectors";
import { Dataset, Proposal } from "state-management/models";
import {
  TableColumn,
  PageChangeEvent,
} from "shared/modules/table/table.component";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { fetchLogbookAction } from "state-management/actions/logbooks.actions";
import { APP_CONFIG, AppConfig } from "app-config.module";

export interface TableData {
  pid: string;
  name: string;
  sourceFolder: string;
  size: string;
  creationTime: string | null;
  owner: string;
  location: string;
}

@Component({
  selector: "view-proposal-page",
  templateUrl: "view-proposal-page.component.html",
  styleUrls: ["view-proposal-page.component.scss"],
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
  currentPage$ = this.store.select(selectDatasetsPage);
  datasetCount$ = this.store.select(selectDatasetsCount);
  itemsPerPage$ = this.store.select(selectDatasetsPerPage);

  proposal: Proposal = new Proposal();

  subscriptions: Subscription[] = [];

  tablePaginate = true;
  tableData: TableData[] = [];
  tableColumns: TableColumn[] = [
    { name: "name", icon: "portrait", sort: false, inList: true },
    { name: "sourceFolder", icon: "explore", sort: false, inList: true },
    { name: "size", icon: "save", sort: false, inList: true },
    { name: "creationTime", icon: "calendar_today", sort: false, inList: true },
    { name: "owner", icon: "face", sort: false, inList: true },
    { name: "location", icon: "explore", sort: false, inList: true },
  ];

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private route: ActivatedRoute,
    private router: Router,
    private slicePipe: SlicePipe,
    private store: Store
  ) {}

  formatTableData(datasets: Dataset[]): TableData[] {
    let tableData: TableData[] = [];
    if (datasets) {
      tableData = datasets.map((dataset: any) => ({
        pid: dataset.pid,
        name: dataset.datasetName,
        sourceFolder:
          "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
        size: this.filesizePipe.transform(dataset.size),
        creationTime: this.datePipe.transform(
          dataset.creationTime,
          "yyyy-MM-dd HH:mm"
        ),
        owner: dataset.owner,
        location: dataset.creationLocation,
      }));
    }
    return tableData;
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeDatasetsPageAction({ page: event.pageIndex, limit: event.pageSize })
    );
    this.store.dispatch(
      fetchProposalDatasetsAction({ proposalId: this.proposal.proposalId })
    );
  }

  onRowClick(dataset: Dataset) {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectCurrentProposal).subscribe((proposal) => {
        if (proposal) {
          this.proposal = proposal;
          if (this.appConfig.logbookEnabled) {
            this.store.dispatch(
              fetchLogbookAction({ name: this.proposal.proposalId })
            );
          }
        }
      })
    );

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.store.dispatch(fetchProposalAction({ proposalId: params.id }));
        this.store.dispatch(
          fetchProposalDatasetsAction({ proposalId: params.id })
        );
      })
    );

    this.subscriptions.push(
      this.store.select(selectProposalDatasets).subscribe((datasets) => {
        this.tableData = this.formatTableData(datasets);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
