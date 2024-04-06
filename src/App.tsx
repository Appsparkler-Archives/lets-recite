import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { toArray } from "lodash";
import React from "react";

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

const TRAVEL_POSTS_URL =
  "https://learningpwa-610f0-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json";

function App() {
  const [cards, setCards] = useState<ITravelCard[]>([]);
  const fetchAndSetCards = () => {
    fetch(TRAVEL_POSTS_URL)
      .then((res) => res.json())
      .then((cards: Record<string, ITravelCard>) => {
        const travelCards = toArray(cards);
        setCards(travelCards);
      });
  };

  const handleClickEnableNotifications = () => {
    // notifyMe();
  };

  useEffect(() => {
    fetchAndSetCards();
  }, []);

  return (
    <Box display="flex" flexDirection={"column"} px={2} gap={2}>
      {"Notification" in window && (
        <Button onClick={handleClickEnableNotifications}>
          enable notifications
        </Button>
      )}
      {cards.map((card) => (
        <MyTravelCard key={card.id} card={card} />
      ))}
    </Box>
  );
}

export default App;
