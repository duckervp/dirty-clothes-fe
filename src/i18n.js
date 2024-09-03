import i18next from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

const currentLng = () => {
  const lang = JSON.parse(localStorage.getItem("persist:lang"));
  return lang?.value.replaceAll("\"", "") || "vi";

}

i18next
  .use(initReactI18next)
  // .use(LanguageDetector)
  .use(Backend)
  .init({
    debug: true,
    fallbackLng: currentLng(),
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });