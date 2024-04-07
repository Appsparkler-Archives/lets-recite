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
    askForNotificationPermission();
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

function configurePushSub() {
  const hasServiceWorker = "serviceWorker" in navigator;
  let reg: ServiceWorkerRegistration;
  if (hasServiceWorker) {
    navigator.serviceWorker.ready
      .then((swreg) => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then((sub) => {
        if (sub === null) {
          const vapidPublicKey =
            "BISu13vjQ7H4yuNEGZkX40q71hIZlSynY27nUsAkxdsmet3y6HkO2XHfh0AffBRF_dhSolAcufB0lBLvNNSHcEc";
          const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey,
          });
        }
      })
      .then((newSub) => {
        if (newSub) {
          return fetch(
            "https://learningpwa-610f0-default-rtdb.asia-southeast1.firebasedatabase.app/subscriptions.json",
            {
              method: "POST",
              body: JSON.stringify(newSub),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
        }
      })
      .then((res) => res?.json())
      .then((res) => {
        if (res.ok) {
          displayConfirmNotification();
        }
      })
      .catch((err) => {
        console.error("Could not subscribe to notifications", err);
      });
  }
}

function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    console.log("User Choice", result);
    if (result !== "granted") {
      console.log("No notification permission granted!");
    } else {
      configurePushSub();
    }
  });
}

function displayConfirmNotification() {
  if ("serviceWorker" in navigator) {
    const options: NotificationOptions = {
      body: "You successfully subscribed to our Notification service!",
      // icon: "/src/images/icons/app-icon-96x96.png",
      // image: "/src/images/sf-boat.jpg",
      // dir: "ltr",
      // lang: "en-US", // BCP 47,
      // vibrate: [100, 50, 200],
      // badge: "/src/images/icons/app-icon-96x96.png",
      // tag: "confirm-notification",
      // renotify: true,
      // actions: [
      //   {
      //     action: "confirm",
      //     title: "Okay",
      //     icon: "/src/images/icons/app-icon-96x96.png",
      //   },
      //   {
      //     action: "cancel",
      //     title: "Cancel",
      //     icon: "/src/images/icons/app-icon-96x96.png",
      //   },
      // ],
    };

    navigator.serviceWorker.ready.then(function (swreg) {
      swreg.showNotification("Successfully subscribed!", options);
    });
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default App;
