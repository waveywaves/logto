import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import reactStringReplace from 'react-string-replace';

import ConfirmModal from '../ConfirmModal';
import TextLink from '../TextLink';

type Props = {
  isOpen?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  termsUrl: string;
};

const TermsOfUseModal = ({ isOpen = false, termsUrl, onConfirm, onClose }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'main_flow' });

  const terms = t('description.terms_of_use');
  const content = t('description.agree_with_terms_modal', { terms });

  const modalContent: ReactNode = reactStringReplace(content, terms, () => (
    <TextLink key={terms} text="description.terms_of_use" href={termsUrl} target="_blank" />
  ));

  return (
    <ConfirmModal isOpen={isOpen} onConfirm={onConfirm} onClose={onClose}>
      {modalContent}
    </ConfirmModal>
  );
};

export default TermsOfUseModal;