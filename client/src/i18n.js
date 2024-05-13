// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Welcome": "Welcome to the Application",
      "Email Address": "Email Address",
      "Password": "Password",
      "Login": "Login",
      "Sign up": "Sign up"
    }
  },
  fr: {
    translation: {
      "Welcome": "Bienvenue dans l'application",
      "Email Address": "Adresse électronique",
      "Password": "Mot de passe",
      "Login": "Connexion",
      "Sign up": "S'inscrire"
    }
  }
};

i18n
    .use(initReactI18next) // Подключаем react-i18next
    .use(LanguageDetector) // Автоматическое определение языка
    .init({
      resources,
      fallbackLng: 'en', // Язык по умолчанию, используется при отсутствии перевода
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage', 'cookie']
      },
      interpolation: {
        escapeValue: false // Не экранировать значения
      }
    });

export default i18n;
