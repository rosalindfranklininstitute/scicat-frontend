import * as fromSelectors from "./user.selectors";

import { UserState } from "../state/user.store";
import { User, UserIdentity, Settings } from "../models";
import { AccessToken } from "shared/sdk";

const user = new User({
  id: "testId",
  realm: "testRealm",
  username: "testName",
  email: "test@email.com",
  emailVerified: true,
  password: "testPassword",
  accessTokens: [],
  identities: [],
  credentials: [],
});

const userIdentity: UserIdentity = {
  id: "testId",
  user,
  provider: "testProvider",
  authScheme: "testScheme",
  externalId: "testId",
  credentials: null,
  userId: "testId",
  created: new Date(),
  modified: new Date(),
  profile: {
    id: "testId",
    displayName: "testName",
    email: "test@email.com",
    username: "testName",
    thumbnailPhoto: "data",
  },
};

const catamelToken: AccessToken = {
  id: "testId",
  ttl: 100,
  scopes: ["string"],
  created: new Date(),
  userId: "testId",
  user: null,
};

const settings: Settings = {
  tapeCopies: "one",
  datasetCount: 25,
  jobCount: 25,
  darkTheme: false,
};

const initialUserState: UserState = {
  currentUser: user,
  profile: userIdentity.profile,
  accountType: "testType",

  catamelToken,

  settings,

  message: undefined,

  isLoggingIn: false,
  isLoggedIn: false,

  isLoading: false,

  columns: [{ name: "datasetName", order: 1, type: "standard", enabled: true }],
};

describe("User Selectors", () => {
  describe("selectCurrentUser", () => {
    it("should select currentUser", () => {
      expect(
        fromSelectors.selectCurrentUser.projector(initialUserState)
      ).toEqual(user);
    });
  });

  describe("selectCurrentUserId", () => {
    it("should select the id from currentUser", () => {
      expect(
        fromSelectors.selectCurrentUserId.projector(
          initialUserState.currentUser
        )
      ).toEqual("testId");
    });
  });

  describe("selectProfile", () => {
    it("should select profile", () => {
      expect(fromSelectors.selectProfile.projector(initialUserState)).toEqual(
        userIdentity.profile
      );
    });
  });

  describe("selectCurrentUserName", () => {
    it("should select the username either from profile or currentUser", () => {
      expect(
        fromSelectors.selectCurrentUserName.projector(
          initialUserState.profile,
          initialUserState.currentUser
        )
      ).toEqual("testName");
    });
  });

  describe("selectThumbnailPhoto", () => {
    it("should return a thumbnail photo string if it exists", () => {
      expect(
        fromSelectors.selectThumbnailPhoto.projector(initialUserState.profile)
      ).toEqual("data");
    });
  });

  describe("selectIsAdmin", () => {
    it("should return false if currentUser is not a functional account", () => {
      const username = initialUserState.currentUser
        ? initialUserState.currentUser.username
        : "";
      expect(
        fromSelectors.selectIsAdmin.projector(
          username,
          initialUserState.accountType
        )
      ).toEqual(false);
    });
  });

  describe("selectCatamelToken", () => {
    it("should select catamelToken", () => {
      expect(
        fromSelectors.selectCatamelToken.projector(initialUserState)
      ).toEqual(catamelToken.id);
    });
  });

  describe("selectUserMessage", () => {
    it("should select message", () => {
      expect(fromSelectors.selectUserMessage.projector(initialUserState)).toBe(
        undefined
      );
    });
  });

  describe("selectSettings", () => {
    it("should select settings", () => {
      expect(fromSelectors.selectSettings.projector(initialUserState)).toEqual(
        settings
      );
    });
  });

  describe("selectTapeCopies", () => {
    it("should select tapeCopies from settings", () => {
      expect(
        fromSelectors.selectTapeCopies.projector(initialUserState.settings)
      ).toEqual("one");
    });
  });

  describe("selectTheme", () => {
    it("it should select darkTheme from settings", () => {
      expect(
        fromSelectors.selectTheme.projector(initialUserState.settings)
      ).toEqual(false);
    });
  });

  describe("selectIsLoggingIn", () => {
    it("should select isLoggingIn", () => {
      expect(
        fromSelectors.selectIsLoggingIn.projector(initialUserState)
      ).toEqual(false);
    });
  });

  describe("selectIsLoggedIn", () => {
    it("should select isLoggedIn", () => {
      expect(
        fromSelectors.selectIsLoggedIn.projector(initialUserState)
      ).toEqual(false);
    });
  });

  describe("selectIsLoading", () => {
    it("should select isLoading", () => {
      expect(fromSelectors.selectIsLoading.projector(initialUserState)).toEqual(
        false
      );
    });
  });

  describe("selectColumns", () => {
    it("should select columns", () => {
      expect(fromSelectors.selectColumns.projector(initialUserState)).toEqual([
        { name: "datasetName", order: 1, type: "standard", enabled: true },
      ]);
    });
  });
});
