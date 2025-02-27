import * as fromSelectors from "./proposals.selectors";
import { Proposal, ProposalInterface, Attachment } from "shared/sdk/models";
import { ProposalsState } from "state-management/state/proposals.store";

const data: ProposalInterface = {
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup",
};
const proposal = new Proposal(data);
const attachments = [new Attachment()];
proposal.attachments = attachments;

const initialProposalsState: ProposalsState = {
  proposals: [],
  currentProposal: proposal,
  datasets: [],

  proposalsCount: 0,
  datasetsCount: 0,

  hasPrefilledFilters: true,

  proposalFilters: {
    text: "test",
    dateRange: {
      begin: new Date(2019, 11, 1).toISOString(),
      end: new Date(2019, 11, 2).toISOString(),
    },
    sortField: "test asc",
    skip: 0,
    limit: 25,
  },
  datasetFilters: {
    text: "test",
    sortField: "test asc",
    skip: 0,
    limit: 25,
  },
};

describe("Proposal Selectors", () => {
  describe("selectProposals", () => {
    it("should select proposals", () => {
      expect(
        fromSelectors.selectProposals.projector(initialProposalsState)
      ).toEqual([]);
    });
  });

  describe("selectCurrentProposal", () => {
    it("should select current proposal", () => {
      expect(
        fromSelectors.selectCurrentProposal.projector(initialProposalsState)
      ).toEqual(proposal);
    });
  });

  describe("selectCurrentAttachments", () => {
    it("should select attachments from current proposal", () => {
      expect(
        fromSelectors.selectCurrentAttachments.projector(
          initialProposalsState.currentProposal
        )
      ).toEqual(attachments);
    });
  });

  describe("selectProposalDatasets", () => {
    it("should select datasets belonging to current proposal", () => {
      expect(
        fromSelectors.selectProposalDatasets.projector(initialProposalsState)
      ).toEqual([]);
    });
  });

  describe("selectProposalsCount", () => {
    it("should select the number of proposals", () => {
      expect(
        fromSelectors.selectProposalsCount.projector(initialProposalsState)
      ).toEqual(0);
    });
  });

  describe("selectDatasetsCount", () => {
    it("should select the number of datasets", () => {
      expect(
        fromSelectors.selectDatasetsCount.projector(initialProposalsState)
      ).toEqual(0);
    });
  });

  describe("selectHasPrefilledFilters", () => {
    it("should select hasPrefilledFilters", () => {
      expect(
        fromSelectors.selectHasPrefilledFilters.projector(initialProposalsState)
      ).toEqual(true);
    });
  });

  describe("selectFilters", () => {
    it("should select the proposal filters", () => {
      expect(
        fromSelectors.selectFilters.projector(initialProposalsState)
      ).toEqual(initialProposalsState.proposalFilters);
    });
  });

  describe("selectTextFilter", () => {
    it("should select the proposal text filter", () => {
      expect(
        fromSelectors.selectTextFilter.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual("test");
    });
  });

  describe("selectDateRangeFilter", () => {
    it("should select dateRange from proposalFilters", () => {
      expect(
        fromSelectors.selectDateRangeFilter.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual({
        begin: new Date(2019, 11, 1).toISOString(),
        end: new Date(2019, 11, 2).toISOString(),
      });
    });
  });

  describe("selectHasAppliedFilters", () => {
    it("should return true if text or dateRange filter has value", () => {
      expect(
        fromSelectors.selectHasAppliedFilters.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual(true);
    });
  });

  describe("selectDatasetFilters", () => {
    it("should select the dataset filters", () => {
      expect(
        fromSelectors.selectDatasetFilters.projector(initialProposalsState)
      ).toEqual(initialProposalsState.datasetFilters);
    });
  });

  describe("selectPage", () => {
    it("should select the current proposals page", () => {
      const { skip, limit } = initialProposalsState.proposalFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual(page);
    });
  });

  describe("selectDatasetsPage", () => {
    it("should select the current datasets page", () => {
      const { skip, limit } = initialProposalsState.datasetFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectDatasetsPage.projector(
          initialProposalsState.datasetFilters
        )
      ).toEqual(page);
    });
  });

  describe("selectProposalsPerPage", () => {
    it("should select limit from proposal filters", () => {
      const { limit } = initialProposalsState.proposalFilters;
      expect(
        fromSelectors.selectProposalsPerPage.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual(limit);
    });
  });

  describe("selectDatasetsPerPage", () => {
    it("should select limit from datasets filters", () => {
      const { limit } = initialProposalsState.datasetFilters;
      expect(
        fromSelectors.selectDatasetsPerPage.projector(
          initialProposalsState.datasetFilters
        )
      ).toEqual(limit);
    });
  });

  describe("selectFullqueryParams", () => {
    it("should select query params for proposals", () => {
      const fullqueryKeys = Object.keys(
        fromSelectors.selectFullqueryParams.projector(
          initialProposalsState.proposalFilters
        )
      );
      expect(fullqueryKeys).toContain("query");
    });
  });

  describe("selectDatasetsQueryParams", () => {
    it("should select query params for datasets", () => {
      const { text, skip, limit, sortField } =
        initialProposalsState.datasetFilters;
      const limits = { order: sortField, skip, limit };
      const params = { query: JSON.stringify({ text }), limits };
      expect(
        fromSelectors.selectDatasetsQueryParams.projector(
          initialProposalsState.datasetFilters
        )
      ).toEqual(params);
    });
  });
});
