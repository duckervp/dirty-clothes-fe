import { useTranslation } from "react-i18next";

import { showErrorMessage, showSuccessMessage } from "src/utils/notify";

export default function useNotify() {
  const { t } = useTranslation('message');

  const showErrorMsg = (error, customKey) => {
    const { status, data } = error;
    let message;
    if (!status) {
      message = t('custom.error.no-server-response');
    } else if (status === 401) {
      message = t('custom.error.unauthorized');
    } else if (status === 400 && data.code) {
      message = t(`code.${data.code}`);
    } else {
      message = t(customKey);
    }
    showErrorMessage(message || t('custom.error.unexpected-error'));
  }

  const showSuccessMsg = (customKey) => {
    showSuccessMessage(t(customKey));
  }

  return { showErrorMsg, showSuccessMsg };
}