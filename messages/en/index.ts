import common from "./common.json";
import heroBanner from "./components/heroBanner.json";
import numberedCards from "./components/numberedCards.json";
import askOrganizer from "./components/askOrganizer.json";
import featureGrid from "./components/featureGrid.json";
import footer from "./components/footer.json";
import header from "./components/header.json";
import homeHeader from "./components/homeHeader.json";
import languageSwitcher from "./components/languageSwitcher.json";
import menuBar from "./components/menuBar.json";
import quoteBlock from "./components/quoteBlock.json";
import ruleCard from "./components/ruleCard.json";
import ruleStack from "./components/ruleStack.json";
import home from "./pages/home.json";
import templates from "./pages/templates.json";
import learn from "./pages/learn.json";
import login from "./pages/login.json";
import profile from "./pages/profile.json";
import navigation from "./navigation.json";
import metadata from "./metadata.json";
import communication from "./create/communication.json";
import createInformational from "./create/informational.json";
import createCommunityName from "./create/communityName.json";
import createCommunitySize from "./create/communitySize.json";
import createCommunityContext from "./create/communityContext.json";
import createCommunityStructure from "./create/communityStructure.json";
import createCommunityUpload from "./create/communityUpload.json";
import createCommunitySave from "./create/communitySave.json";
import createReview from "./create/review.json";
import createConfirmStakeholders from "./create/confirmStakeholders.json";
import createFinalReview from "./create/finalReview.json";
import createCompleted from "./create/completed.json";
import createRightRail from "./create/rightRail.json";
import createFooter from "./create/footer.json";
import createTopNav from "./create/topNav.json";
import createDraftHydration from "./create/draftHydration.json";
import createPublish from "./create/publish.json";
import createTemplateReview from "./create/templateReview.json";

export default {
  common,
  heroBanner,
  numberedCards,
  askOrganizer,
  featureGrid,
  footer,
  header,
  homeHeader,
  languageSwitcher,
  menuBar,
  quoteBlock,
  ruleCard,
  ruleStack,
  pages: {
    home,
    templates,
    learn,
    login,
    profile,
  },
  create: {
    communication,
    informational: createInformational,
    communityName: createCommunityName,
    communitySize: createCommunitySize,
    communityContext: createCommunityContext,
    communityStructure: createCommunityStructure,
    communityUpload: createCommunityUpload,
    communitySave: createCommunitySave,
    review: createReview,
    confirmStakeholders: createConfirmStakeholders,
    finalReview: createFinalReview,
    completed: createCompleted,
    rightRail: createRightRail,
    footer: createFooter,
    topNav: createTopNav,
    draftHydration: createDraftHydration,
    publish: createPublish,
    templateReview: createTemplateReview,
  },
  navigation,
  metadata,
};
