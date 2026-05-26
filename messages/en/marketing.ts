/**
 * Marketing-scoped message bundle: every namespace from `./index` EXCEPT the
 * `create.*` subtree. The `create` namespace is ~41 KB gzipped — the largest
 * single contributor to per-route HTML size — and is only used inside
 * `(app)/create/*`. Excluding it from the `(marketing)` group's
 * `MessagesProvider` removes the embed from every marketing HTML response.
 *
 * The type stays compatible with `typeof import("./index").default` because
 * we satisfy the same key shape (modulo `create`); marketing client
 * components only read keys that exist here. If a future change reaches into
 * `messages.create.*` from a marketing surface, `getTranslation` will return
 * the dotted key as the fallback — visible immediately at runtime.
 *
 * Keep this in sync with new entries added to `./index` (excluding `create/`).
 * See `docs/perf/next16-eval.md` for measurement context.
 */
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
import controlsChrome from "./components/controlsChrome.json";
import logoWall from "./components/logoWall.json";
import topNav from "./components/topNav.json";
import home from "./pages/home.json";
import templates from "./pages/templates.json";
import learn from "./pages/learn.json";
import about from "./pages/about.json";
import useCases from "./pages/useCases.json";
import useCasesDetail from "./pages/useCasesDetail.json";
import useCasesCompletedRules from "./pages/useCasesCompletedRules.json";
import useCasesCompletedRule from "./pages/useCasesCompletedRule.json";
import howItWorks from "./pages/howItWorks.json";
import monitor from "./pages/monitor.json";
import login from "./pages/login.json";
import profile from "./pages/profile.json";
import notFoundPage from "./pages/notFoundPage.json";
import ruleDetail from "./pages/ruleDetail.json";
import navigation from "./navigation.json";
import metadata from "./metadata.json";
import modalsShare from "./modals/share.json";
import modalsPopoverExport from "./modals/popoverExport.json";
import modalsAskOrganizerInquiry from "./modals/askOrganizerInquiry.json";
import type messages from "./index";

const marketingMessages = {
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
  controlsChrome,
  logoWall,
  topNav,
  pages: {
    home,
    templates,
    learn,
    about,
    useCases,
    useCasesDetail,
    useCasesCompletedRules,
    useCasesCompletedRule,
    howItWorks,
    monitor,
    login,
    profile,
    notFoundPage,
    ruleDetail,
  },
  navigation,
  metadata,
  modals: {
    share: modalsShare,
    popoverExport: modalsPopoverExport,
    askOrganizerInquiry: modalsAskOrganizerInquiry,
  },
};

// Cast to the full shape so it satisfies `typeof import("./index").default`
// at the MessagesProvider boundary. Reads of `messages.create.*` from a
// marketing surface are a code smell and will return the dotted key (the
// runtime `getTranslation` fallback) — visible immediately.
export default marketingMessages as typeof messages;

