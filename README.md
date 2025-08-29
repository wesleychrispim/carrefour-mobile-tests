# Carrefour Mobile Tests (WebdriverIO + Appium + Mocha + Chai + Allure)

Automação **Android (local)** e **iOS (BrowserStack)** do *native demo app* do WebdriverIO, com **10 cenários** cobrindo Login/Sign up, Forms, Navegação, Swipe e Drag & Drop.  
Relatórios em **Allure**, screenshots automáticos em falha e massa **data-driven** (JSON).

## Requisitos

- **Node.js 20+** (Appium 3 exige Node 20.19+)
- **Java 17 (Temurin)**  
- **Android SDK** + **emulador** (ex.: Pixel_34)  
- **Appium 3** e driver UiAutomator2:
  ```bash
  npm i -g appium @appium/doctor
  appium driver install uiautomator2
