import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform ,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Linking,
  Modal,
  Pressable,

  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Purchases from "react-native-purchases";

import ConfettiCannon from "react-native-confetti-cannon";

import { SafeAreaView } from "react-native-safe-area-context";
/* ✅ HANDLER GLOBAL NOTIFICATIONS (UNE SEULE FOIS) */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});




const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 16;
const CARD_GAP = 14;

// largeur d’une case jour (2 colonnes)
const DAY_CARD_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
// hauteur proche de la maquette
const DAY_CARD_HEIGHT = DAY_CARD_WIDTH * 1.45;


// --- Images locales pour les jours sobres (img1.jpg -> img31.jpg) ---
// --- Images locales pour les jours sobres (dossier assets/images/img) ---
// Images SOBER stockées dans assets/images/img/
const DAY_IMAGES = [
  require("../../assets/images/img/img1.jpg"),
  require("../../assets/images/img/img2.jpg"),
  require("../../assets/images/img/img3.jpg"),
  require("../../assets/images/img/img4.jpg"),
  require("../../assets/images/img/img5.jpg"),
  require("../../assets/images/img/img6.jpg"),
  require("../../assets/images/img/img7.jpg"),
  require("../../assets/images/img/img8.jpg"),
  require("../../assets/images/img/img9.jpg"),
  require("../../assets/images/img/img10.jpg"),
  require("../../assets/images/img/img11.jpg"),
  require("../../assets/images/img/img12.jpg"),
  require("../../assets/images/img/img13.jpg"),
  require("../../assets/images/img/img14.jpg"),
  require("../../assets/images/img/img15.jpg"),
  require("../../assets/images/img/img16.jpg"),
  require("../../assets/images/img/img17.jpg"),
  require("../../assets/images/img/img18.jpg"),
  require("../../assets/images/img/img19.jpg"),
  require("../../assets/images/img/img20.jpg"),
  require("../../assets/images/img/img21.jpg"),
  require("../../assets/images/img/img22.jpg"),
  require("../../assets/images/img/img23.jpg"),
  require("../../assets/images/img/img24.jpg"),
  require("../../assets/images/img/img25.jpg"),
  require("../../assets/images/img/img26.jpg"),
  require("../../assets/images/img/img27.jpg"),
  require("../../assets/images/img/img28.jpg"),
  require("../../assets/images/img/img29.jpg"),
  require("../../assets/images/img/img30.jpg"),
  require("../../assets/images/img/img31.jpg"),
];



// --- Citations possibles ---
const QUOTES = [
  "Tu peux toujours recommencer.",
  "Un pas de côté ne change pas ta direction.",
  "L’important, c’est de te relever.",
  "Une chute ne t’enlève pas ta force.",
  "Le courage, c’est d’essayer encore.",
  "Ton futur ne dépend pas de cette soirée.",
  "Tu n’as rien perdu, tu apprends.",
  "Ce n’est qu’une pause, pas la fin.",
  "La victoire se construit avec les reprises.",
  "Le boss de ta vie, c’est encore toi.",
  "Pardonne-toi, avance.",
  "Défaite temporaire, pour un bonheur durable.",
  "Juste un faux pas sur le chemin de ta victoire.",
  "Le printemps revient toujours.",
  "Rien de brisé. Tout à bâtir.",
  "Grandir n’est jamais une ligne droite.",
  "Ce soir n’efface pas tes objectifs.",
  "Regarde devant, c’est là que ça se passe.",
  "Continue, c’est déjà une victoire.",
  "N’oublie pas d’être ton allié.",
  "Le chemin appartient à ceux qui restent.",
  "Ce moment ne dit rien de ta destination.",
  "Une ombre passe, ta lumière reste.",
  "Sois fier de l’effort, pas triste de l’écart.",
  "Tu gagnes déjà en persévérant.",
  "On repart.",
  "Rien n’est fini.",
  "Une erreur ne définit pas ton histoire.",
];

const DEFAULT_QUOTE = "Une erreur ne définit pas ton histoire.";


// >>>>>>>>> ICÔNES PNG DES CARTES <<<<<<<<<
const haloIcon = require("../../assets/images/halo.png");
const flameSmallIcon = require("../../assets/images/flame-small.png");
const flameBigIcon = require("../../assets/images/flame-big.png");
const hourglassIcon = require("../../assets/images/hourglass.png");

// pages jour
const medalIcon = require("../../assets/images/medal.png");
const wineIcon = require("../../assets/images/wine.png");
const wineGreyIcon = require("../../assets/images/wine-grey.png");

const mailIcon = require("../../assets/images/icons/mail.png");
const bellIcon = require("../../assets/images/icons/bell.png");
const docIcon = require("../../assets/images/icons/doc.png");
const lockIcon = require("../../assets/images/icons/lock.png");
const binIcon = require("../../assets/images/icons/bin.png");


// --- Mois / Années ---
const MONTH_NAMES_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MONTH_SHORT_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

// pour le header de la modale jour
const WEEKDAYS_FR = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

const MONTH_SHORT_LABEL_FR = [
  "jan",
  "fév",
  "mar",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sep",
  "oct",
  "nov",
  "déc",
];

const MONTHS_2025 = Array.from({ length: 12 }, (_, i) => ({
  id: `2025-${i + 1}`,
  monthIndex: i, // 0 = janvier, 11 = décembre
  year: 2025,
}));

const JANVIER_SOBRE_2026 = {
  id: "2026-1",
  monthIndex: 0,
  year: 2026,
};

const STORAGE_KEY_DAY_STATE = "dayStateByMonth_v1"; // <== AJOUT ICI
const STORAGE_KEY_NOTIFICATIONS = "notificationsEnabled_v1";
const STORAGE_KEY_ONBOARDING = "onboardingCompleted_v1";
const STORAGE_KEY_FIRST_LAUNCH = "firstLaunchCompleted_v1";






type GroupChoice = "2025" | "JAN2026";

type DayStatus = "none" | "sober" | "drank" | "skip";
type DayState = {
  status: DayStatus;
  level?: 1 | 2 | 3;    // 1 = moins, 2 = comme, 3 = plus
  imageIndex?: number;  // index dans DAY_IMAGES pour les jours sobres
  quoteIndex?: number;  // index dans QUOTES pour les citations
};


type DayStateByMonth = Record<string, Record<number, DayState>>;
type DrinkFrequency = "daily" | "several" | "weekly_or_occasionally" | null;



// clé unique "année-mois"
const getMonthKey = (year: number, monthIndex: number) =>
  `${year}-${monthIndex}`;



const Index: React.FC = () => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const initialGroup: GroupChoice =
    now.getFullYear() === 2026 && now.getMonth() === 0
      ? "JAN2026"
      : "2025";

  // ========== TOUS LES useState (dans le bon ordre) ==========

  // Sélecteur de mois
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupChoice>(initialGroup);

  // État des jours par mois (clé "année-mois")
  const [dayStateByMonth, setDayStateByMonth] = useState<DayStateByMonth>({});

  // Pages JOUR
  const [isDayModalVisible, setDayModalVisible] = useState(false);
  const [dayModalStep, setDayModalStep] = useState<1 | 2 | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Confettis + stats
  const [showCongrats, setShowCongrats] = useState(false);
  const [isStatsModalVisible, setStatsModalVisible] = useState(false);

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4>(1);
  const [userName, setUserName] = useState("");
  const [drinkFrequency, setDrinkFrequency] = useState<DrinkFrequency>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  // Paramètres
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);
  // First launch + paywall
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [rcReady, setRcReady] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");

  



  // Flow "Envie de boire ?"
  const [isCravingVisible, setCravingVisible] = useState(false);
  const [cravingStep, setCravingStep] = useState<1 | 2 | 3>(1);
  const [cravingTimer, setCravingTimer] = useState(60);





  // ========== useEffect ==========

  useEffect(() => {
    let mounted = true;
  
    const syncPremium = async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        const active = !!info.entitlements.active["premium"];
        if (mounted) setIsPremium(active);
      } catch (e) {
        console.log("RC error:", e);
        if (mounted) setIsPremium(false);
      } finally {
        if (mounted) setRcReady(true);
      }
    };
  
    syncPremium();
  
    const onCustomerInfoUpdate = (info: any) => {
      const active = !!info.entitlements.active["premium"];
      setIsPremium(active);
    };
  
    Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);
  
    return () => {
      mounted = false;
      Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
    };
  }, []);
  
  
  
  




  // Charger les données sauvegardées au lancement
  useEffect(() => {
    const loadStoredState = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_DAY_STATE);
        if (raw) {
          const parsed = JSON.parse(raw);
          setDayStateByMonth(parsed);
        }

        const storedNotif = await AsyncStorage.getItem(
          STORAGE_KEY_NOTIFICATIONS
        );
        if (storedNotif != null) {
          setNotificationsEnabled(storedNotif === "true");
        }

        const storedFirstLaunch = await AsyncStorage.getItem(STORAGE_KEY_FIRST_LAUNCH);
    console.log(storedFirstLaunch)
if (storedFirstLaunch === null) {
  setIsFirstLaunch(true);     // jamais lancé → onboarding
} else {
  setIsFirstLaunch(false);    // déjà lancé → pas d’onboarding
}





        // pas de lecture d'onboarding ici : on veut l'afficher à chaque démarrage
      } catch (err) {
        console.log(
          "Erreur lors du chargement du state depuis AsyncStorage",
          err
        );
      } finally {
        setHasLoadedSettings(true);
      }
      
    };

    loadStoredState();
  }, []);

  // Timer de 30 secondes pour l'écran 1 "Respire avant de décider"
  useEffect(() => {
    if (!isCravingVisible || cravingStep !== 1) return;

    // reset timer à chaque ouverture / retour sur l'écran 1
    setCravingTimer(60);

    const interval = setInterval(() => {
      setCravingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCravingVisible, cravingStep]);

  useEffect(() => {
    if (!hasLoadedSettings) return;
  
    const syncNotifications = async () => {
      try {
        // OFF → on annule tout
        if (!notificationsEnabled) {
          await Notifications.cancelAllScheduledNotificationsAsync();
          return;
        }
  
        // ON → on programme
        if (!Device.isDevice) return;
  
        const { status } = await Notifications.getPermissionsAsync();
        let finalStatus = status;
  
        if (status !== "granted") {
          const permission = await Notifications.requestPermissionsAsync();
          finalStatus = permission.status;
        }
  
        if (finalStatus !== "granted") {
          // cohérence UI
          setNotificationsEnabled(false);
          await AsyncStorage.setItem(STORAGE_KEY_NOTIFICATIONS, "false");
          return;
        }
  
        // Android channel (obligatoire si tu veux le son/importance sur Android)
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("daily-reminder", {
            name: "Rappel quotidien",
            importance: Notifications.AndroidImportance.MAX,
            sound: "default",
          });
        }
  
        // évite doublons
        await Notifications.cancelAllScheduledNotificationsAsync();
  
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Sober Month",
            body: "Avez-vous bu aujourd’hui ?",
            data: { type: "OPEN_TODAY" },
            // (optionnel) sur Android tu peux aussi forcer ici :
            ...(Platform.OS === "android" ? { channelId: "daily-reminder" } : {}),
          },
          // ✅ FIX IMPORTANT : trigger DOIT contenir type, et sur Android channelId
          trigger:
            Platform.OS === "android"
              ? ({
                  type: "daily",
                  hour: 22,
                  minute: 0,
                  channelId: "daily-reminder",
                } as Notifications.NotificationTriggerInput)
              : ({
                  type: "daily",
                  hour: 22,
                  minute: 0,
                } as Notifications.NotificationTriggerInput),
        });
      } catch (e) {
        console.log("Erreur syncNotifications:", e);
      }
    };
  
    syncNotifications();
  }, [notificationsEnabled, hasLoadedSettings]);
  
  
  

  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
  
        if (data?.type === "OPEN_TODAY") {
          const now = new Date();
          const todayDay = now.getDate();
  
          setSelectedYear(now.getFullYear());
          setSelectedMonthIndex(now.getMonth());
  
          setSelectedDay(todayDay);
          setDayModalStep(1);
          setDayModalVisible(true);
        }
      });
  
    return () => subscription.remove();
  }, []);
  
  // useEffect(() => {
  //   Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
  
  //   Purchases.configure({
  //     apiKey: "key",
  //   });
  // }, []);
  
  



  // ========== DÉRIVÉS CALENDRIER / STATS DE BASE ==========

  const currentMonthKey = getMonthKey(selectedYear, selectedMonthIndex);
  const isCurrentSelectedMonth =
    selectedYear === now.getFullYear() &&
    selectedMonthIndex === now.getMonth();

  const selectedMonthLabel =
    MONTH_NAMES_FR[selectedMonthIndex]?.toUpperCase() ?? "JANVIER";

  // nb de jours dans le mois sélectionné
  const daysInMonth = new Date(
    selectedYear,
    selectedMonthIndex + 1,
    0
  ).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // état du mois courant
  const monthState = dayStateByMonth[currentMonthKey] ?? {};

  // borne max pour le calcul du streak :
  // - mois courant : jusqu'à aujourd'hui
  // - autres mois : jusqu'à la fin du mois
  const limitDayForStreak = isCurrentSelectedMonth
    ? Math.min(today.getDate() - 1, daysInMonth)
    : daysInMonth;

  // --- calcul stats du mois sélectionné ---



  // --- calcul stats du mois sélectionné ---
  let totalSober = 0;
  let yellowDays = 0;
  let orangeDays = 0;
  let redDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const state = monthState[d];
    if (state?.status === "sober") {
      totalSober++;
    }
    if (state?.status === "drank") {
      if (state.level === 1) yellowDays++;
      else if (state.level === 2) orangeDays++;
      else if (state.level === 3) redDays++;
    }
  }

  // plus longue série de jours sobres consécutifs (sur le mois)
  let maxSoberStreak = 0;
  let tmpStreak = 0;
  for (let d = 1; d <= limitDayForStreak; d++) {
    const state = monthState[d];
    if (state?.status === "sober") {
      tmpStreak++;
      if (tmpStreak > maxSoberStreak) {
        maxSoberStreak = tmpStreak;
      }
    } else {
      tmpStreak = 0;
    }
  }

  // série ACTUELLE de jours sobres consécutifs :
  // on part du dernier jour RENSEIGNÉ (avant aujourd'hui) et on remonte
  let currentSoberStreak = 0;
  if (isCurrentSelectedMonth) {
    const endDay = Math.min(today.getDate() - 1, daysInMonth);

    // 1) on cherche le dernier jour renseigné (sobre, bu ou passer)
    let lastFilledDay = 0;
    for (let d = endDay; d >= 1; d--) {
      const state = monthState[d];
      if (state) {
        lastFilledDay = d;
        break;
      }
    }

    // 2) on remonte depuis ce jour pour compter les jours sobres consécutifs
    if (lastFilledDay > 0) {
      let streak = 0;
      for (let d = lastFilledDay; d >= 1; d--) {
        const state = monthState[d];
        if (state?.status === "sober") {
          streak++;
        } else {
          break; // dès qu'on tombe sur un jour NON sobre ou vide, on arrête
        }
      }
      currentSoberStreak = streak;
    }
  } else {
    currentSoberStreak = 0;
  }


  // jours restants basés sur le calendrier
  const isPastMonth =
    selectedYear < now.getFullYear() ||
    (selectedYear === now.getFullYear() &&
      selectedMonthIndex < now.getMonth());

  const isFutureMonth =
    selectedYear > now.getFullYear() ||
    (selectedYear === now.getFullYear() &&
      selectedMonthIndex > now.getMonth());

  const daysRemaining = isPastMonth
    ? 0
    : isCurrentSelectedMonth
    ? Math.max(daysInMonth - today.getDate(), 0)
    : daysInMonth;

  const openMonthPicker = () => {
    if (selectedYear === 2026 && selectedMonthIndex === 0) {
      setSelectedGroup("JAN2026");
    } else {
      setSelectedGroup("2025");
    }
    setMonthPickerVisible(true);
  };

  const openDayModal = (day: number) => {
    setSelectedDay(day);
    setDayModalStep(1);
    setDayModalVisible(true);
  };

  const closeDayModal = () => {
    setDayModalVisible(false);
    setDayModalStep(null);
    setSelectedDay(null);
  };

  const selectedDayLabel =
    selectedDay != null
      ? (() => {
          const d = new Date(selectedYear, selectedMonthIndex, selectedDay);
          const weekday = WEEKDAYS_FR[d.getDay()];
          const monthShort = MONTH_SHORT_LABEL_FR[d.getMonth()];
          return `${weekday} ${selectedDay} ${monthShort}`;
        })()
      : "";

  // JE N'AI PAS BU
  const handleSetSober = () => {
    if (selectedDay != null) {
      setDayStateByMonth((prev: Record<string, Record<number, DayState>>) => {
        const stateForMonth = prev[currentMonthKey] ?? {};
        const existing = stateForMonth[selectedDay];
  
        // Images déjà utilisées pour d'autres jours sobres du même mois
        const usedImages = new Set<number>();
        Object.entries(stateForMonth).forEach(([dayStr, s]) => {
          const d = Number(dayStr);
          if (
            d !== selectedDay &&
            s?.status === "sober" &&
            typeof s.imageIndex === "number"
          ) {
            usedImages.add(s.imageIndex);
          }
        });
  
        const allIndexes = DAY_IMAGES.map((_, idx) => idx);
        const available = allIndexes.filter(
          (idx) => !usedImages.has(idx)
        );
  
        let imageIndex =
          existing && typeof existing.imageIndex === "number"
            ? existing.imageIndex
            : undefined;
  
        if (imageIndex == null) {
          const pool = available.length > 0 ? available : allIndexes;
          const rand = Math.floor(Math.random() * pool.length);
          imageIndex = pool[rand];
        }
  
        const next: Record<string, Record<number, DayState>> = {
          ...prev,
          [currentMonthKey]: {
            ...stateForMonth,
            [selectedDay]: { status: "sober", imageIndex },
          },
        };
  
        AsyncStorage.setItem(
          STORAGE_KEY_DAY_STATE,
          JSON.stringify(next)
        ).catch((err) => {
          console.log("Erreur sauvegarde state (sober)", err);
        });
  
        return next;
      });
    }
    closeDayModal();
    setShowCongrats(true);
  };
  
  


  // MOINS / COMME / PLUS
  const handleDrinkLevel = (level: 1 | 2 | 3) => {
    if (selectedDay != null) {
      setDayStateByMonth((prev: Record<string, Record<number, DayState>>) => {
        const stateForMonth = prev[currentMonthKey] ?? {};
        const existing = stateForMonth[selectedDay];
  
        let quoteIndex =
          existing && typeof existing.quoteIndex === "number"
            ? existing.quoteIndex
            : undefined;
  
        if (quoteIndex == null) {
          quoteIndex = Math.floor(Math.random() * QUOTES.length);
        }
  
        const next: Record<string, Record<number, DayState>> = {
          ...prev,
          [currentMonthKey]: {
            ...stateForMonth,
            [selectedDay]: { status: "drank", level, quoteIndex },
          },
        };
  
        AsyncStorage.setItem(
          STORAGE_KEY_DAY_STATE,
          JSON.stringify(next)
        ).catch((err) => {
          console.log("Erreur sauvegarde state (drank)", err);
        });
  
        return next;
      });
    }
    closeDayModal();
  };
  
  


  // PASSER
  const handleSkipDay = () => {
    if (selectedDay != null) {
      setDayStateByMonth((prev: Record<string, Record<number, DayState>>) => {
        const stateForMonth = prev[currentMonthKey] ?? {};
        const existing = stateForMonth[selectedDay];
  
        let quoteIndex =
          existing && typeof existing.quoteIndex === "number"
            ? existing.quoteIndex
            : undefined;
  
        if (quoteIndex == null) {
          quoteIndex = Math.floor(Math.random() * QUOTES.length);
        }
  
        const next: Record<string, Record<number, DayState>> = {
          ...prev,
          [currentMonthKey]: {
            ...stateForMonth,
            [selectedDay]: { status: "skip", quoteIndex },
          },
        };
  
        AsyncStorage.setItem(
          STORAGE_KEY_DAY_STATE,
          JSON.stringify(next)
        ).catch((err) => {
          console.log("Erreur sauvegarde state (skip)", err);
        });
  
        return next;
      });
    }
    closeDayModal();
  };
  
  
  const toggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    AsyncStorage.setItem(
      STORAGE_KEY_NOTIFICATIONS,
      value ? "true" : "false"
    ).catch((err) => {
      console.log("Erreur sauvegarde notifications", err);
    });
  };
  
  const handleSendEmail = () => {
    Linking.openURL(
      "mailto:contact@tonapp.com?subject=Feedback%20Sober%20App"
    ).catch(() => {});
  };
  
  const handleOpenTerms = () => {
    // TODO: remplace par l’URL de tes CGU
    Linking.openURL("https://sobermonth.app/utilisation/").catch(() => {});
  };
  
  const handleOpenPrivacy = () => {
    // TODO: remplace par l’URL de ta politique de confidentialité
    Linking.openURL("https://sobermonth.app/confidentialite/").catch(() => {});
  };
  
  const handleResetData = () => {
    Alert.alert(
      "Réinitialiser les données",
      "Tu es sûr de vouloir effacer tout l’historique ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, réinitialiser",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY_DAY_STATE);
              setDayStateByMonth({});
            } catch (e) {
              console.log("Erreur reset data", e);
            }
          },
        },
      ]
    );
  };
  
  const finishOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, "true");
    setIsFirstLaunch(false);
    setShowOnboarding(false);
  };
  

// bascule la sélection d'une raison (optionnel mais sympa)
const toggleReason = (reason: string) => {
  setSelectedReasons((prev) => {
    if (prev.includes(reason)) {
      return prev.filter((r) => r !== reason);
    }
    return [...prev, reason];
  });
};

// useEffect(() => {
//   if (isFirstLaunch === false && isPremium === false && onboardingStep !== 4) {
//     setOnboardingStep(4);
//   }
// }, [isFirstLaunch, isPremium, onboardingStep]);



 console.log(onboardingStep,isFirstLaunch, showOnboarding,"ONNN")
  // PAGE 4 (paywall) = composant Paywall
  if (onboardingStep === 4) {
    return(
    <SafeAreaView style={[styles.onboardSafe, {justifyContent:'center', alignItems:'center'}]}>
      <Text >Sober-month Coming Soon</Text>
    </SafeAreaView>
    )
    
    // return null
    // pageContent = <Paywall />;
  }

// ================== ONBOARDING + PAYWALL ==================
// --- ONBOARDING (1er lancement) ---
if (showOnboarding) {
  let pageContent: React.ReactNode = null;

  // PAGE 1
  if (onboardingStep === 1) {
    pageContent = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
        <Text style={[styles.onboardTitle, { textAlign: "center" }]}>Comment vous appelez-vous ?</Text>

        <Text style={[styles.onboardSubtitle, { textAlign: "center" }]}>
          On va personnaliser ton défi Sober Month.
        </Text>

        <View style={{ width: "65%", marginTop: 20 }}>
          <TextInput
            style={styles.onboardInput}
            placeholder="Prénom"
            placeholderTextColor="#B0B0B0"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.onboardButton,
            { width: "90%", alignSelf: "center", marginTop: 12 },
            userName.trim().length < 2 && styles.onboardButtonDisabled,
          ]}
          activeOpacity={0.9}
          disabled={userName.trim().length < 2}
          onPress={() => setOnboardingStep(2)}
        >
          <Text style={styles.onboardButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // PAGE 2
  if (onboardingStep === 2) {
    pageContent = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
        <Text style={[styles.onboardTitle, { textAlign: "center" }]}>À quelle fréquence buvez-vous ?</Text>
        <Text style={[styles.onboardSubtitle, { textAlign: "center" }]}>Soyez honnête, c’est pour vous aider.</Text>

        <View style={[styles.onboardChoicesColumn, { width: "100%", alignItems: "center" }]}>
          <TouchableOpacity
            style={styles.onboardChoiceButton}
            activeOpacity={0.9}
            onPress={() => {
              setDrinkFrequency("daily");
              setOnboardingStep(3);
            }}
          >
            <Text style={styles.onboardChoiceText}>Presque tous les jours</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.onboardChoiceButton}
            activeOpacity={0.9}
            onPress={() => {
              setDrinkFrequency("several");
              setOnboardingStep(3);
            }}
          >
            <Text style={styles.onboardChoiceText}>Plusieurs fois par semaine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.onboardChoiceButton}
            activeOpacity={0.9}
            onPress={() => {
              setDrinkFrequency("weekly_or_occasionally");
              setOnboardingStep(3);
            }}
          >
            <Text style={styles.onboardChoiceText}>Une fois par semaine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.onboardChoiceButton}
            activeOpacity={0.9}
            onPress={() => {
              setDrinkFrequency("weekly_or_occasionally");
              setOnboardingStep(3);
            }}
          >
            <Text style={styles.onboardChoiceText}>Occasionnellement</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // PAGE 3
  if (onboardingStep === 3) {
    let reasons: string[] = [];

    if (drinkFrequency === "daily") {
      reasons = [
        "Reprendre le contrôle sur ma consommation",
        "Sentir mon corps et mon esprit plus clairs",
        "Me prouver que je peux m’en sortir",
        "Arrêter la fatigue permanente",
        "Améliorer ma santé dès maintenant",
      ];
    } else if (drinkFrequency === "several") {
      reasons = [
        "Retrouver énergie et motivation maximale",
        "Améliorer mon sommeil et mes matinées",
        "Avoir plus de contrôle sur mes sorties",
        "Réduire mes dépenses d'alcool",
        "Me sentir fier(e) de réussir un défi personnel",
      ];
    } else {
      reasons = [
        "Me sentir au top physiquement et mentallement",
        "Améliorer concentration et productivité",
        "Mieux dormir et récupérer",
        "Réduire mes dépenses d'alcool",
        "Dépasser mes limites et réussir un challenge",
      ];
    }

    pageContent = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
        <Text style={[styles.onboardTitle, { textAlign: "center" }]}>Pourquoi souhaitez-vous arrêter 1 mois ?</Text>

        {userName.trim().length > 0 && (
          <Text style={[styles.onboardSubtitle, { textAlign: "center", marginTop: 4 }]}>
            {userName.trim()}, choisissez ce qui vous parle le plus.
          </Text>
        )}

        <View style={[styles.onboardChoicesColumn, { width: "100%", alignItems: "center", marginTop: 16 }]}>
          {reasons.map((reason) => {
            const selected = selectedReasons.includes(reason);
            return (
              <TouchableOpacity
                key={reason}
                style={[styles.onboardChoiceButton, selected && styles.onboardChoiceButtonSelected]}
                activeOpacity={0.9}
                onPress={() => toggleReason(reason)}
              >
                <Text style={[styles.onboardChoiceText, selected && styles.onboardChoiceTextSelected]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.onboardButton, { width: "80%", alignSelf: "center", marginTop: 20 }]}
          activeOpacity={0.9}
          onPress={async () =>

             setOnboardingStep(4)
            // await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, "true")
          }
        >
          <Text style={styles.onboardButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    );
  }

 

  return (
    <SafeAreaView style={styles.onboardSafe}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.onboardRoot, styles.onboardCentered]}>{pageContent}</View>
    </SafeAreaView>
  );
}
// On attend d'avoir chargé AsyncStorage
if (isFirstLaunch === null || !rcReady) {
  return null;
}


const startTrial = async () => {
  try {
    setIsPurchasing(true);

    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      Alert.alert("Erreur", "Aucune offering RevenueCat trouvée (offerings.current est null).");
      return;
    }

    const pkg = selectedPlan === "annual" ? current.annual : current.monthly;

    if (!pkg) {
      Alert.alert("Erreur", `Package ${selectedPlan} introuvable dans l'offering RevenueCat.`);
      return;
    }

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const active = !!customerInfo.entitlements.active["premium"];
    setIsPremium(active);

    if (active) {
      await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, "true");
      setIsFirstLaunch(false);
      setShowOnboarding(false);
    } else {
      Alert.alert("Info", "Achat fait mais entitlement premium inactive.");
    }
  } catch (e: any) {
    if (e?.userCancelled) return;
    console.log("Purchase error:", e);
    Alert.alert("Erreur", "Impossible de démarrer l’essai. Réessaie.");

  } finally {
    setIsPurchasing(false);
  }
};

const restorePurchases = async () => {
  try {
    setIsPurchasing(true);
    const info = await Purchases.restorePurchases();
    const active = !!info.entitlements.active["premium"];
    setIsPremium(active);

    if (active) {
      await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, "true");
      setIsFirstLaunch(false);
      setShowOnboarding(false);
    } else {
      Alert.alert("Info", "Aucun abonnement actif à restaurer.");
    }
  } catch (e) {
    console.log("Restore error:", e);
    Alert.alert("Erreur", "Restauration impossible.");
  } finally {
    setIsPurchasing(false);
  }
};

const purchase = async (plan: "monthly" | "annual") => {
  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;

    if (!offering) {
      Alert.alert("Erreur", "Aucune offre disponible");
      return;
    }

    const targetProductId =
      plan === "monthly"
        ? "sobermonth_monthly"
        : "sobermonth_yearly";

    const pkg = offering.availablePackages.find(
      (p) => p.product.identifier === targetProductId
    );

    if (!pkg) {
      Alert.alert(
        "Erreur",
        `Produit introuvable : ${targetProductId}`
      );
      return;
    }

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const active = !!customerInfo.entitlements.active["premium"];
    if (active) {
      setIsPremium(true);
      await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, "true");
      setIsFirstLaunch(false);
      setShowOnboarding(false);
    }
  } catch (e: any) {
    if (!e.userCancelled) {
      Alert.alert(
        "Erreur de paiement",
        e?.message ?? "Une erreur est survenue"
      );
    }
  }
};



// --- JSX PAYWALL (réutilisable: onboarding step 4 + hard paywall) ---
const Paywall = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 24,
    }}
  >
    {/* TITRE */}
    <Text style={[styles.onboardTitle, { textAlign: "center" }]}>
      🏆 Félicitations !
    </Text>

    <Text
      style={{
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 22,
      }}
    >
      Vous avez décidé de vous dépasser 🎯
    </Text>

    {/* BÉNÉFICES */}
    <View style={{ width: "100%", marginBottom: 26 }}>
      <Text style={{ fontSize: 15, lineHeight: 22 }}>
        • <Text style={{ fontWeight: "700" }}>+25% d’énergie</Text> dès la première semaine{"\n"}
        • <Text style={{ fontWeight: "700" }}>+30% de qualité du sommeil</Text>{"\n"}
        • <Text style={{ fontWeight: "700" }}>–2 kg en moyenne</Text> au bout d’un mois{"\n"}
        • <Text style={{ fontWeight: "700" }}>+40% de motivation</Text> et de bonne humeur{"\n"}
        • <Text style={{ fontWeight: "700" }}>Peau plus nette</Text> et teint plus éclatant{"\n"}
        • <Text style={{ fontWeight: "700" }}>Économies importantes</Text>{"\n"}
        • Santé renforcée : risques de maladies{" "}
        <Text style={{ fontWeight: "700" }}>nettement réduits</Text>
      </Text>

      <Text
        style={{
          fontSize: 15,
          marginTop: 16,
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        3 500+ personnes ont déjà transformé leur relation à l’alcool.
      </Text>
    </View>

    {/* ESSAI */}
    <Text
      style={{
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
      }}
    >
      ⭐ Essai gratuit 7 jours
    </Text>

    {/* BOUTONS MENSUEL / ANNUEL */}
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        width: "100%",
        marginBottom: 10,
      }}
    >
      {/* MENSUEL */}
      <TouchableOpacity
        style={[
          styles.planButton,
          selectedPlan === "monthly" && styles.planButtonSelected,
        ]}
        activeOpacity={0.9}
        onPress={() => setSelectedPlan("monthly")}
      >
        <Text
          style={[
            styles.planTitle,
            selectedPlan === "monthly" && styles.planTextSelected,
          ]}
        >
          Mensuel
        </Text>
        <Text
          style={[
            styles.planPrice,
            selectedPlan === "monthly" && styles.planTextSelected,
          ]}
        >
          0€
        </Text>
      </TouchableOpacity>

      {/* ANNUEL */}
      <TouchableOpacity
        style={[
          styles.planButton,
          selectedPlan === "annual" && styles.planButtonSelected,
        ]}
        activeOpacity={0.9}
        onPress={() => setSelectedPlan("annual")}
      >
        <Text
          style={[
            styles.planTitle,
            selectedPlan === "annual" && styles.planTextSelected,
          ]}
        >
          Annuel
        </Text>
        <Text
          style={[
            styles.planPrice,
            selectedPlan === "annual" && styles.planTextSelected,
          ]}
        >
          0€
        </Text>
      </TouchableOpacity>
    </View>

    {/* TEXTE PRIX */}
    <Text style={styles.planSubtitle}>
      Puis 4,99 € / mois ou 24,99 € / an (≈ 2 € / mois) – annulable à tout moment
    </Text>

    {/* BOUTON PRINCIPAL */}
    <TouchableOpacity
      style={[
        styles.onboardButton,
        { width: "80%", alignSelf: "center", marginTop: 6 },
      ]}
      activeOpacity={0.9}
      onPress={async () => {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      Alert.alert("Erreur", "Offre indisponible");
      return;
    }

    const targetProductId =
      selectedPlan === "annual" ? "sobermonth_yearly" : "sobermonth_monthly";

    // 🔥 On cherche le package qui correspond EXACTEMENT à ton productId
    const pkg = current.availablePackages.find(
      (p) => p.product.identifier === targetProductId
    );

    if (!pkg) {
      Alert.alert("Erreur", `Abonnement introuvable (${targetProductId})`);
      return;
    }

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const isActive = !!customerInfo.entitlements.active["premium"];

    if (isActive) {
      await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, "true");
      setIsFirstLaunch(false);
      setShowOnboarding(false);
      setIsPremium(true);
    } else {
      Alert.alert("Info", "Abonnement non actif pour le moment.");
    }
  } catch (e: any) {
    if (e?.userCancelled) return;
    console.log("Purchase error:", e);
    Alert.alert("Erreur", e?.message ?? "Paiement échoué");
  }
}}

      
    >
      <Text style={styles.onboardButtonText}>
        Commencer gratuitement
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
  activeOpacity={0.7}
  onPress={() => {
    // plus tard : Purchases.restorePurchases()
    console.log("restore purchases");
  }}
>
  <Text
    style={{
      marginTop: 10,
      fontSize: 13,
      textDecorationLine: "underline",
      color: "#555",
    }}
  >
    Restaurer mes achats
  </Text>
</TouchableOpacity>


    {/* TEXTE FOOTER */}
    <Text
      style={{
        fontSize: 14,
        textAlign: "center",
        marginTop: 12,
        color: "#444",
      }}
    >
      Ton futur toi te dira merci ✨
    </Text>
  </View>
);








};

/* --- COMPOSANTS DE JOUR --- */

interface DayProps {
  day: number;
  canEdit: boolean;
  hasDrinkInfo: boolean;
  drinkLevel?: 1 | 2 | 3;
  isSkipped?: boolean;
  quoteText?: string;
}

const renderDrinkGlassesRow = (level?: 1 | 2 | 3) => {
  // couleur de la pastille selon le niveau
  let dotColor = "#fedb2a"; // 1 verre
  if (level === 2) dotColor = "#ff931e"; // 2 verres
  if (level === 3) dotColor = "#e40000"; // 3 verres

  return (
    <View style={styles.drinkGlassesRow}>
      <View style={styles.drinkGlassesPill}>
        <Image
          source={level && level >= 1 ? wineIcon : wineGreyIcon}
          style={styles.drinkGlassIcon}
          resizeMode="contain"
        />
        <Image
          source={level && level >= 2 ? wineIcon : wineGreyIcon}
          style={styles.drinkGlassIcon}
          resizeMode="contain"
        />
        <Image
          source={level && level >= 3 ? wineIcon : wineGreyIcon}
          style={styles.drinkGlassIcon}
          resizeMode="contain"
        />
      </View>

      {level && (
        <View
          style={[
            styles.drinkLevelDot,
            { backgroundColor: dotColor },
          ]}
        />
      )}
    </View>
  );
};

const DayQuoteCard: React.FC<DayProps> = ({
  day,
  canEdit,
  hasDrinkInfo,
  drinkLevel,
  isSkipped,
  quoteText,
}) => {
  const showPlus = canEdit && !hasDrinkInfo && !isSkipped;
  const text = quoteText ?? DEFAULT_QUOTE;

  return (
    <View style={[styles.dayCard, isSkipped && styles.dayCardSkipped]}>
      <Text style={styles.dayNumber}>{day}</Text>
      <Text
        style={[
          styles.dayQuote,
          isSkipped && styles.dayQuoteCentered,
        ]}
      >
        {text}
      </Text>



      {canEdit && hasDrinkInfo && renderDrinkGlassesRow(drinkLevel)}

      {showPlus && (
        <View style={styles.drinkRowWrapper}>
          <View style={styles.drinkRow}>
            <View style={styles.drinkPlusCircle}>
              <Ionicons name="add" size={20} color="#000" />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// carte pour jour sobre : fond nature + gros chiffre blanc
// carte pour jour sobre : fond nature + gros chiffre blanc
const DaySoberCard: React.FC<{ day: number; backgroundImage: ImageSourcePropType }> = ({
  day,
  backgroundImage,
}) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.dayCard, styles.dayImageCard]}
      imageStyle={styles.dayImageBackground}
    >
      <Text style={styles.dayNumberImage}>{day}</Text>
    </ImageBackground>
  );
};


const DayEmptyCard: React.FC<DayProps> = ({
  day,
  canEdit,
  hasDrinkInfo,
}) => {
  const showPlus = canEdit && !hasDrinkInfo;

  return (
    <View style={styles.dayCard}>
      <Text style={styles.dayNumber}>{day}</Text>

      {showPlus && (
        <View style={styles.emptyBottomWrapper}>
          <View style={styles.emptyPlusBox}>
            <Ionicons name="add" size={26} color="#000" />
          </View>
        </View>
      )}
    </View>
  );
};

/* --- STYLES --- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  root: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    position: "relative",
  },

  /* STICKY HEADER */
  stickyHeader: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    zIndex: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  topIconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  mainCTA: {
    flex: 1,
    height: 70,
    borderRadius: 36,
    backgroundColor: "#266DFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  mainCTATitle: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  mainCTASubtitle: {
    color: "white",
    fontWeight: "800",
    fontSize: 20,
    marginTop: 2,
  },

  /* ONBOARDING */
  onboardSafe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  onboardRoot: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center", // ⬅ Centre verticalement
    alignItems: "center",     // ⬅ Centre horizontalement
  },
  
  onboardTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "left",
    marginBottom: 12,
  },
  onboardSubtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 24,
  },

  onboardCentered: {
    width: "100%",
    alignItems: "center",
  },

  
  onboardInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#F9F9F9",
  },
  
  
  onboardButton: {
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: "#000",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  onboardButtonDisabled: {
    opacity: 0.4,
  },
  onboardButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  onboardChoicesColumn: {
    marginTop: 8,
    gap: 12,
  },
  onboardChoiceButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
  },
  onboardChoiceButtonSelected: {
    backgroundColor: "#266DFF",
    borderColor: "#266DFF",
  },
  onboardChoiceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  onboardChoiceTextSelected: {
    color: "#FFFFFF",
  },
  onboardBulletBlock: {
    marginTop: 8,
  },
  onboardBulletText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  onboardTrialText: {
    fontSize: 16,
    fontWeight: "700",
  },
  onboardFooterText: {
    marginTop: 10,
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },




  /* CARTES DE STATS */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    height: 86,
    borderRadius: 18,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#EDEDED",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
    overflow: "hidden",
  },
  statCardLight: {
    backgroundColor: "#EDEDED",
  },
  statCardMiddle: {
    backgroundColor: "#E9C88B",
  },

  statContentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
  },
  statLabel: {
    fontSize: 13,
    color: "#444",
    marginTop: 0,
    textAlign: "center",
  },


  // stickers stats
  statStickerTopCenter: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  stickerHalo: {
    width: 160,
    height: 64,
  },
  statStickerFlames: {
    position: "absolute",
    top: -6,
    left: 8,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    pointerEvents: "none",
  },
  stickerFlameSmall: {
    width: 44,
    height: 44,
  },
  stickerFlameBig: {
    width: 60,
    height: 60,
  },
  statStickerHourglass: {
    position: "absolute",
    top: 0,
    right: -5,
    pointerEvents: "none",
  },
  stickerHourglass: {
    width: 60,
    height: 60,
  },

  monthSelectorWrapper: {
    alignItems: "center",
    marginTop: 6,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#FBFBFB",
  },
  monthArrows: {
    marginRight: 16,
    alignItems: "center",
  },
  monthText: {
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 1,
  },
  monthStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#3ED93E",
    marginLeft: 18,
  },
  headerDivider: {
    marginTop: 10,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#F0F0F0",
  },

  /* MODAL MOIS / ANNEES */
  monthModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  monthModalCard: {
    width: "90%",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
  monthModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  yearChip: {
    flex: 1,
    marginRight: 8,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "transparent",
  },
  yearChipSelected: {
    borderColor: "#266DFF",
    borderWidth: 2,
  },
  yearChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  yearChipTextSelected: {
    color: "#000",
  },

  jan2026Chip: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6E3B5",
    borderWidth: 1,
    borderColor: "transparent",
  },
  jan2026ChipSelected: {
    borderColor: "#E0B94C",
    borderWidth: 2,
  },
  jan2026Text: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#5C4315",
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
  },
  monthChip: {
    width: "23%",
    marginBottom: 10,
    borderRadius: 14,
    paddingVertical: 8,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  monthChipSelected: {
    backgroundColor: "#266DFF",
  },
  monthChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  monthChipYearText: {
    fontSize: 10,
    color: "#777",
    marginTop: 2,
  },
  monthChipTextSelected: {
    color: "#FFFFFF",
  },
  monthChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3ED93E",
    marginTop: 4,
  },

  /* MODAL JOUR (questions boire / quantité) */
  dayModalSafe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  dayModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  dayModalHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  dayModalContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  dayModalQuestion: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
  },
  dayModalChoices: {
    marginTop: 70,
    alignItems: "center",
    gap: 28,
  },
  dayChoiceCard: {
    width: 240,
    height: 210,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#E4E4E4",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dayChoiceIcon: {
    width: 80,
    height: 80,
    marginBottom: 18,
  },
  dayChoiceLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },

  dayModalQuestionStep2: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
  },
  dayStep2Buttons: {
    marginTop: 60,
    alignItems: "center",
    gap: 22,
  },
  dayStep2Button: {
    width: "100%",
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "#E4E4E4",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dayStep2ButtonText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  dayStep2SkipButton: {
    marginTop: 10,
    width: 180,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "#E4E4E4",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dayStep2SkipButtonText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.8,
  },

  /* MODAL STATS */
  statsModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsModalCard: {
    width: "90%",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8,
  },
  statsModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },

  /* OVERLAY CONFETTIS */
  congratsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  /* PARAMÈTRES */
  settingsSafe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  settingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  settingsTitle: {
    fontSize: 32,
    fontWeight: "800",
  },
  settingsScroll: {
    flex: 1,
  },
  settingsScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E4E4",
  },
  settingsIcon: {
    width: 26,
    height: 26,
    marginRight: 16,
  },
  settingsTextBlock: {
    flex: 1,
  },
  settingsRowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingsRowSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  settingsRowDanger: {
    marginTop: 8,
  },
  settingsRowTitleDanger: {
    color: "#E53935",
  },
  settingsVersion: {
    textAlign: "center",
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 24,
  },



  /* SCROLL / CALENDRIER */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
    paddingBottom: 24,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  dayCard: {
    width: DAY_CARD_WIDTH,
    height: DAY_CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    marginBottom: CARD_GAP,
    paddingHorizontal: 18,
    paddingVertical: 18,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  dayNumber: {
    fontSize: 48,
    fontWeight: "800",
    color: "#000",
  },
  dayQuote: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginTop: 8,
  },

  dayQuoteCentered: {
    textAlign: "center",
    marginTop: 0,
    marginBottom: 0,
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: [{ translateY: -10 }],
  },
  
  dayCardSkipped: {},


  dayImageCard: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dayImageBackground: {
    borderRadius: 24,
  },
  dayNumberImage: {
    fontSize: 72,
    fontWeight: "800",
    color: "#FFFFFF",
    position: "absolute",
    left: 28,
    top: 26,
  },

  // rangée verres
  drinkGlassesRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  drinkGlassesPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  drinkGlassIcon: {
    width: 22,
    height: 28,
    marginHorizontal: 0,
  },
  drinkLevelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },

  // rangée du +
  drinkRowWrapper: {
    alignItems: "center",
    marginTop: 24,
  },
  drinkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  drinkPlusCircle: {
    width: 28,
    height: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBottomWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  emptyPlusBox: {
    width: 90,
    height: 70,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
  },


  onboardStep1Container: {
    flex: 1,
    justifyContent: "center",   // milieu vertical
    alignItems: "center",        // milieu horizontal
    paddingHorizontal: 24,
  },
  
  onboardTitleCenter: {
    textAlign: "center",
  },
  
  onboardInputNarrow: {
    width: "70%",                // case prénom plus étroite
    alignSelf: "center",
  },
  
  onboardButtonNarrow: {
    width: "70%",                // bouton aligné avec le champ
    alignSelf: "center",
  },

    /* FLOW "ENVIE DE BOIRE ?" */
    cravingSafe: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    cravingHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 16,
    },
    cravingHeaderTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    cravingContent: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "center",   // contenu centré verticalement
    },
    
    cravingTitle: {
      fontSize: 24,
      fontWeight: "800",
      marginBottom: 10,
      textAlign: "center",   // ⬅ centre le titre sur les 3 écrans
    },
    cravingSubtitle: {
      fontSize: 15,
      color: "#555",
      marginBottom: 24,
      textAlign: "center",   // ⬅ centre le texte sous le titre
    },
    
    cravingTimerWrapper: {
      alignItems: "center",
      marginTop: 10,
      marginBottom: 24,
    },
    cravingTimerCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: "#266DFF",
      alignItems: "center",
      justifyContent: "center",
    },
    cravingTimerText: {
      fontSize: 32,
      fontWeight: "800",
    },
    cravingTimerHint: {
      marginTop: 8,
      fontSize: 13,
      color: "#666",
    },
    cravingPrimaryButton: {
      borderRadius: 999,
      backgroundColor: "#000",
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    cravingPrimaryButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    cravingSecondaryButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "#D0D0D0",
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    cravingSecondaryButtonText: {
      fontSize: 14,
      color: "#555",
      fontWeight: "500",
    },
    cravingReasonsContainer: {
      marginTop: 12,
      flexWrap: "wrap",
      flexDirection: "row",
      gap: 8,
    },
    cravingReasonChip: {
      borderRadius: 16,
      backgroundColor: "#F4F4F4",
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    cravingReasonText: {
      fontSize: 13,
      color: "#222",
    },
    cravingMessage: {
      fontSize: 14,
      color: "#333",
      lineHeight: 20,
    },
    cravingMessageBold: {
      fontWeight: "700",
    },
  





    planButton: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#E2E2E2",
      paddingVertical: 8,     // ⬅️ plus petit
      paddingHorizontal: 6,   // ⬅️ plus petit
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F9F9F9",
    },
    
    planButtonSelected: {
      backgroundColor: "#266DFF",
      borderColor: "#266DFF",
    },
    
    planTitle: {
      fontSize: 12,           // ⬅️ plus petit
      fontWeight: "600",
      marginBottom: 2,
      color: "#222",
    },
    
    planPrice: {
      fontSize: 16,           // ⬅️ plus petit
      fontWeight: "800",
      color: "#222",
    },
    
    planTextSelected: {
      color: "#FFFFFF",
    },
    
    planSubtitle: {
      fontSize: 12,           // ⬅️ plus petit
      color: "#666",
      textAlign: "center",
      marginBottom: 14,
    },
    
    
  
});

export default Index;
