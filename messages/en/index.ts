import common from "./common.json";
import heroBanner from "./components/heroBanner.json";
import cardSteps from "./components/cardSteps.json";
import askOrganizer from "./components/askOrganizer.json";
import featureGrid from "./components/featureGrid.json";
import footer from "./components/footer.json";
import header from "./components/header.json";
import homeHeader from "./components/homeHeader.json";
import languageSwitcher from "./components/languageSwitcher.json";
import menu from "./components/menu.json";
import quoteBlock from "./components/quoteBlock.json";
import ruleCard from "./components/ruleCard.json";
import ruleStack from "./components/ruleStack.json";
import webVitalsDashboard from "./components/webVitalsDashboard.json";
import home from "./pages/home.json";
import templates from "./pages/templates.json";
import learn from "./pages/learn.json";
import monitor from "./pages/monitor.json";
import login from "./pages/login.json";
import profile from "./pages/profile.json";
import notFoundPage from "./pages/notFoundPage.json";
import navigation from "./navigation.json";
import metadata from "./metadata.json";

// create – stage 1: community
import createInformational from "./create/community/informational.json";
import createCommunityName from "./create/community/communityName.json";
import createCommunityStructure from "./create/community/communityStructure.json";
import createCommunityContext from "./create/community/communityContext.json";
import createCommunitySize from "./create/community/communitySize.json";
import createCommunityUpload from "./create/community/communityUpload.json";
import createCommunitySave from "./create/community/communitySave.json";
import createReview from "./create/community/review.json";

// create – stage 2: customRule
import createCoreValues from "./create/customRule/coreValues.json";
import createCommunication from "./create/customRule/communication.json";
import createMembership from "./create/customRule/membership.json";
import createDecisionApproaches from "./create/customRule/decisionApproaches.json";
import createConflictManagement from "./create/customRule/conflictManagement.json";

// create – stage 3: reviewAndComplete
import createConfirmStakeholders from "./create/reviewAndComplete/confirmStakeholders.json";
import createFinalReview from "./create/reviewAndComplete/finalReview.json";
import createCompleted from "./create/reviewAndComplete/completed.json";
import createPublish from "./create/reviewAndComplete/publish.json";

// create – cross-cutting (chrome + layout-shell strings)
import createFooter from "./create/footer.json";
import createTopNav from "./create/topNav.json";
import createDraftHydration from "./create/draftHydration.json";
import createTemplateReview from "./create/templateReview.json";

export default {
  common,
  heroBanner,
  cardSteps,
  askOrganizer,
  featureGrid,
  footer,
  header,
  homeHeader,
  languageSwitcher,
  menu,
  quoteBlock,
  ruleCard,
  ruleStack,
  webVitalsDashboard,
  pages: {
    home,
    templates,
    learn,
    monitor,
    login,
    profile,
    notFoundPage,
  },
  create: {
    community: {
      informational: createInformational,
      communityName: createCommunityName,
      communityStructure: createCommunityStructure,
      communityContext: createCommunityContext,
      communitySize: createCommunitySize,
      communityUpload: createCommunityUpload,
      communitySave: createCommunitySave,
      review: createReview,
    },
    customRule: {
      coreValues: createCoreValues,
      communication: createCommunication,
      membership: createMembership,
      decisionApproaches: createDecisionApproaches,
      conflictManagement: createConflictManagement,
    },
    reviewAndComplete: {
      confirmStakeholders: createConfirmStakeholders,
      finalReview: createFinalReview,
      completed: createCompleted,
      publish: createPublish,
    },
    footer: createFooter,
    topNav: createTopNav,
    draftHydration: createDraftHydration,
    templateReview: createTemplateReview,
  },
  navigation,
  metadata,
};
