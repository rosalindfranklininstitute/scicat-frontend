import { PublishedDataInterface, PublishedData } from "shared/sdk";
import { GenericFilters } from "state-management/models";
import { PublishedDataState } from "state-management/state/published-data.store";
import * as fromSelectors from "./published-data.selectors";

const data: PublishedDataInterface = {
  doi: "testDOI",
  affiliation: "test affiliation",
  creator: ["test creator"],
  publisher: "test publisher",
  publicationYear: 2019,
  title: "test title",
  abstract: "test abstract",
  dataDescription: "test description",
  resourceType: "test type",
  pidArray: ["testPid"],
};
const publishedData = new PublishedData(data);

const filters: GenericFilters = {
  sortField: "publicationYear desc",
  skip: 0,
  limit: 25,
};

const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: publishedData,

  totalCount: 0,

  filters,
};

describe("Published Data Selectors", () => {
  describe("selectAllPublishedData", () => {
    it("should select publishedData", () => {
      expect(
        fromSelectors.selectAllPublishedData.projector(
          initialPublishedDataState
        )
      ).toEqual([]);
    });
  });

  describe("selectCurrentPublishedData", () => {
    it("should select currentPublishedData", () => {
      expect(
        fromSelectors.selectCurrentPublishedData.projector(
          initialPublishedDataState
        )
      ).toEqual(publishedData);
    });
  });

  describe("selectPublishedDataCount", () => {
    it("should select totalCount", () => {
      expect(
        fromSelectors.selectPublishedDataCount.projector(
          initialPublishedDataState
        )
      ).toEqual(0);
    });
  });

  describe("selectFilters", () => {
    it("should select filters", () => {
      expect(
        fromSelectors.selectFilters.projector(initialPublishedDataState)
      ).toEqual(filters);
    });
  });

  describe("selectPage", () => {
    it("should select current page from filters", () => {
      const { skip, limit } = filters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialPublishedDataState.filters)
      ).toEqual(page);
    });
  });

  describe("selectPublishedDataPerPage", () => {
    it("should select limit from filters", () => {
      const { limit } = filters;
      expect(
        fromSelectors.selectPublishedDataPerPage.projector(
          initialPublishedDataState.filters
        )
      ).toEqual(limit);
    });
  });

  describe("selectQueryParams", () => {
    it("should select query params from filters", () => {
      const { sortField, skip, limit } = filters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.selectQueryParams.projector(
          initialPublishedDataState.filters
        )
      ).toEqual(params);
    });
  });
});
