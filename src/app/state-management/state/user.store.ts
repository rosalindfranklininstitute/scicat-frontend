import { Settings, Message, User } from "../models";
import { AccessToken } from "shared/sdk";
import { APP_DI_CONFIG } from "app-config.module";

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: User;
  profile?: any;
  catamelToken: AccessToken;
  isLoggingIn: boolean;
  selectingColumn: boolean;
  deletingColumn: boolean;
  currentUserGroups: string[];
  email: string;
  message: Message;
  settings: Settings;
  isLoggedIn: boolean;
  accountType?: string;
  columns: string[];
  displayedColumns: string[];
}

export const initialUserState: UserState = {
  currentUser: null,
  profile: null,
  catamelToken: null,
  currentUserGroups: [],
  email: undefined,
  isLoggingIn: false,
  selectingColumn: false,
  deletingColumn: false,
  message: { content: undefined, type: undefined, duration: undefined },
  settings: {
    tapeCopies: "one",
    datasetCount: 25,
    jobCount: 25,
    darkTheme: false
  }, // TODO sync with server settings?
  isLoggedIn: false,
  columns: [
    "select",
    "datasetName",
    "runNumber",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId",
    "ownerGroup",
    "dataStatus",
    "derivedDatasetsNum"
  ],
  displayedColumns: getColumns()
};

function getColumns() {
  let columns = [
    "select",
    "datasetName",
    "runNumber",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId",
    "ownerGroup",
    "dataStatus",
    "derivedDatasetsNum"
  ];
  if (APP_DI_CONFIG.facility === "ESS") {
    columns = APP_DI_CONFIG.localColumns;
  }
  return columns;
}
