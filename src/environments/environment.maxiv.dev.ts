import { TableColumn } from "state-management/models";

export const environment = {
  production: true,
  lbBaseURL: "https://scicat-test.maxiv.lu.se",
  fileserverBaseURL: null,
  synapseBaseUrl: null,
  riotBaseUrl: null,
  jupyterHubUrl: "https://jupyterhub.maxiv.lu.se",
  externalAuthEndpoint: "/auth/msad",
  addDatasetEnabled: true,
  archiveWorkflowEnabled: true,
  columnSelectEnabled: true,
  datasetReduceEnabled: true,
  disabledDatasetColumns: [
    "select",
    "archiveStatus",
    "retrieveStatus",
    "ownerGroup",
  ],
  editDatasetSampleEnabled: false,
  editMetadataEnabled: true,
  editSampleEnabled: true,
  editPublishedData: true,
  facility: "MAX IV",
  gettingStarted: null,
  ingestManual: null,
  fileColorEnabled: true,
  localColumns: [
    { name: "select", order: 0, type: "standard", enabled: true },
    { name: "datasetName", order: 1, type: "standard", enabled: true },
    { name: "runNumber", order: 2, type: "standard", enabled: true },
    { name: "sourceFolder", order: 3, type: "standard", enabled: true },
    { name: "size", order: 4, type: "standard", enabled: true },
    { name: "creationTime", order: 5, type: "standard", enabled: true },
    { name: "type", order: 6, type: "standard", enabled: true },
    { name: "image", order: 7, type: "standard", enabled: true },
    { name: "metadata", order: 8, type: "standard", enabled: true },
    { name: "proposalId", order: 9, type: "standard", enabled: true },
    { name: "ownerGroup", order: 10, type: "standard", enabled: false },
    { name: "dataStatus", order: 11, type: "standard", enabled: false },
    { name: "derivedDatasetsNum", order: 12, type: "standard", enabled: false },
  ] as TableColumn[],
  landingPage: "doi-test.maxiv.lu.se/detail/",
  logbookEnabled: false,
  metadataPreviewEnabled: false,
  fileDownloadEnabled: false,
  multipleDownloadEnabled: false,
  maxDirectDownloadSize: 5000000000,
  multipleDownloadAction: null,
  scienceSearchEnabled: true,
  scienceSearchUnitsEnabled: true,
  searchProposals: true,
  searchPublicDataEnabled: false,
  searchSamples: true,
  sftpHost: null,
  shoppingCartEnabled: true,
  shoppingCartOnHeader: true,
  tableSciDataEnabled: true,
  metadataStructure: "tree",
  userNamePromptEnabled: true,
  userProfileImageEnabled: true,
  jobsEnabled: true,
  jsonMetadataEnabled: true,
  policiesEnabled: true,
};
