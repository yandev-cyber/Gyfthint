let alert, purchaseModalAlert, hintDetailModalAlert;

function configureAlert(ref) {
  alert = ref;
}

function purchaseModalConfig(ref) {
  purchaseModalAlert = ref;
}

function hintDetailModalConfig(ref) {
  hintDetailModalAlert = ref;
}

function show(type, title, message) {
  setTimeout(() => {
    alert.alertWithType(type, title, message);
  }, 1000);
}

function showPurchaseModalAlert(type, title, message) {
  purchaseModalAlert.alertWithType(type, title, message);
}

function showHintDetailModalAlert(type, title, message) {
  hintDetailModalAlert.alertWithType(type, title, message);
}

export default {
  configureAlert,
  purchaseModalConfig,
  hintDetailModalConfig,
  show,
  showPurchaseModalAlert,
  showHintDetailModalAlert,
};
