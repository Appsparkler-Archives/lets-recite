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

  function notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      new Notification("Hi there!");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          new Notification("Hi there!");
          // …
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }

  const handleClickEnableNotifications = () => {
    notifyMe();
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
