export interface TripleStepStep {
  title: string;
  body: string;
}

export interface TripleStepProps {
  heading: string;
  steps: TripleStepStep[];
  ctaText: string;
  ctaHref: string;
  className?: string;
}

export interface TripleStepViewProps extends TripleStepProps {
  headingId: string;
}
