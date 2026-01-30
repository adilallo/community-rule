export interface Card {
  text: string;
  iconShape?: string;
  iconColor?: string;
}

export interface NumberedCardsProps {
  title: string;
  subtitle: string;
  cards: Card[];
}

export interface NumberedCardsViewProps extends NumberedCardsProps {
  schemaJson: string;
}

