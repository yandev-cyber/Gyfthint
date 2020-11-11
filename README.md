# gyfthintApp
gyfthint is E-commerce/Social Networking application, It's a platform for you, your friends and your family to share gift ideas. When you buy a gift through GyftHint

## Prerequisites
1. You need a Mac. This project builds an iOS and Android project from React Native. Unfortunately the only way to build an iOS app is on a Mac.
2. Basic things you will need to install:
- Xcode: https://itunes.apple.com/us/app/xcode/id497799835?mt=12
- Homebrew: 
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
  ```
- Yarn: `brew install yarn` (this also installs node if it is not already installed)
- Ruby: `brew install ruby`
3. There are a number of steps and software that needs to be installed for both iOS and Android you can follow along here: https://reactnative.dev/docs/environment-setup

## Installation
```bash
# Get the code
git clone https://github.com/gyfthint/gyfthint-app.git
cd gyfthint-app

# Install dependencies
yarn install

# Run it
npm run ios
  # or
npm run android
```



## Standard & Guideline

A. Naming Conventions 
    
    1. A folder and sub folder name should always start with small letters and the files belong the folders is always in pascal case.
    2.To name the components, we follow the pattern path based component naming, which include naming the component accordingly to it’s relative path to the folders components or to src.
    3. Include all the control in single import belong to same module end with semicolon. There should be no space between two imports.
    
B. GuideLines

- Crashlytics
- Sonar Lint and Sonar Queue


## Tech/framework used

<b>IDE</b>
- [Visual Studio Code](https://code.visualstudio.com/)

<b>Technology</b>
- [React Native](https://facebook.github.io/react-native/)

<b>Language</b>
- JavaScript - ES6



## Features

<b>Onboarding</b>
-  Splash
-  Welcome
-  Login 
-  Signup

<b>Dashboard</b>
- Landing
- network
- Add Hint
- Calendar
- Hints

<b>AddHint</b>
- Web
- Camera
- Scanner
- ProductInfo-1
- ProductInfo-2
- ProductInfo-3
- Address


<b>Hint</b>
- Detail
- Purchase

<b>SideMenu</b>
- PurchaseHistory
- PaymentInformation
- PrivacyPolicy
- TermsAndConditions
- ContactUs
- ManageCelebrations
- EditProfile


