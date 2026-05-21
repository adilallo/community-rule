/**
 * Figma: "A Guide to CommunityRule" body ornaments (22078:791901)
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22078-791901
 *
 * - 19003:23575 — concentric circles, right (`how-shape-2.svg`)
 * - 19003:23576 — loop mark, left (`how-shape-1.svg`)
 */
import {
  getAssetPath,
  howItWorksOrnamentLeftPath,
  howItWorksOrnamentRightPath,
} from "../../../../lib/assetUtils";

export default function HowItWorksDecorativeShapes() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 hidden aspect-square md:block left-[84.86%] right-[-9.28%] top-[clamp(200px,20vw,255px)]"
        data-node-id="19003:23575"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAssetPath(howItWorksOrnamentRightPath())}
          alt=""
          className="pointer-events-none size-full max-w-none object-cover"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 hidden aspect-square md:block left-[-1.66%] right-[88.38%] top-[clamp(520px,55vw,811px)]"
        data-node-id="19003:23576"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAssetPath(howItWorksOrnamentLeftPath())}
          alt=""
          className="pointer-events-none size-full max-w-none object-cover"
        />
      </div>
    </>
  );
}
