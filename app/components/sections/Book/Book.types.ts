export interface BookProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export interface BookViewProps extends BookProps {
  headingId: string;
}
