import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

interface ITravelCard {
  id: string;
  image: string;
  location: string;
  title: string;
}

const MyTravelCard: React.FC<{
  card: ITravelCard;
}> = ({ card }) => {
  return (
    <Card>
      <CardMedia>
        <img width="100%" src={card.image} alt={card.location} />
      </CardMedia>
      <CardContent>
        <Typography variant="h5">{card.title}</Typography>
        <Typography variant="caption">@{card.location}</Typography>
      </CardContent>
    </Card>
  );
};

function App() {
  const [card, setCard] = useState<null | ITravelCard>(null);
  useEffect(() => {
    fetch(
      "https://learningpwa-610f0-default-rtdb.asia-southeast1.firebasedatabase.app/posts/first-post.json"
    )
      .then((res) => res.json())
      .then((card: ITravelCard) => {
        setCard(card);
      });
  }, []);
  return <Box p={2}>{card && <MyTravelCard card={card} />}</Box>;
}

export default App;
