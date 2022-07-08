import { AdminConsoleKey, I18nKey } from '@logto/phrases';
import { AppearanceMode, Application } from '@logto/schemas';
import { demoAppApplicationId } from '@logto/schemas/lib/seeds';
import { conditionalString } from '@silverhand/essentials';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import CheckDemoDark from '@/assets/images/check-demo-dark.svg';
import CheckDemo from '@/assets/images/check-demo.svg';
import CreateAppDark from '@/assets/images/create-app-dark.svg';
import CreateApp from '@/assets/images/create-app.svg';
import CustomizeDark from '@/assets/images/customize-dark.svg';
import Customize from '@/assets/images/customize.svg';
import FurtherReadingsDark from '@/assets/images/further-readings-dark.svg';
import FurtherReadings from '@/assets/images/further-readings.svg';
import OneClickDark from '@/assets/images/one-click-dark.svg';
import OneClick from '@/assets/images/one-click.svg';
import PasswordlessDark from '@/assets/images/passwordless-dark.svg';
import Passwordless from '@/assets/images/passwordless.svg';
import { RequestError } from '@/hooks/use-api';
import useSettings from '@/hooks/use-settings';
import { useTheme } from '@/hooks/use-theme';

type GetStartedMetadata = {
  id: string;
  title: AdminConsoleKey;
  subtitle: AdminConsoleKey;
  icon: SvgComponent;
  buttonText: I18nKey;
  isComplete?: boolean;
  isHidden?: boolean;
  onClick: () => void;
};

const useGetStartedMetadata = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const theme = useTheme();
  const isLightMode = theme === AppearanceMode.LightMode;
  const { data: demoApp, error } = useSWR<Application, RequestError>(
    `/api/applications/${demoAppApplicationId}`,
    {
      shouldRetryOnError: (error: unknown) => {
        if (error instanceof RequestError) {
          return error.status !== 404;
        }

        return true;
      },
    }
  );
  const navigate = useNavigate();
  const isLoadingDemoApp = !demoApp && !error;
  const hideDemo = error?.status === 404;

  const data = useMemo(() => {
    const metadataItems: GetStartedMetadata[] = [
      {
        id: 'checkDemo',
        title: 'get_started.card1_title',
        subtitle: 'get_started.card1_subtitle',
        icon: isLightMode ? CheckDemo : CheckDemoDark,
        buttonText: 'admin_console.general.check_out',
        isComplete: settings?.demoChecked,
        isHidden: hideDemo,
        onClick: async () => {
          void updateSettings({ demoChecked: true });
          window.open('/demo-app', '_blank');
        },
      },
      {
        id: 'createApplication',
        title: 'get_started.card2_title',
        subtitle: 'get_started.card2_subtitle',
        icon: isLightMode ? CreateApp : CreateAppDark,
        buttonText: 'admin_console.general.create',
        isComplete: settings?.applicationCreated,
        onClick: () => {
          navigate('/applications/create');
        },
      },
      {
        id: 'customizeSignInExperience',
        title: 'get_started.card3_title',
        subtitle: 'get_started.card3_subtitle',
        icon: isLightMode ? Customize : CustomizeDark,
        buttonText: 'admin_console.general.customize',
        isComplete: settings?.signInExperienceCustomized,
        onClick: () => {
          navigate('/sign-in-experience');
        },
      },
      {
        id: 'configurePasswordless',
        title: 'get_started.card4_title',
        subtitle: 'get_started.card4_subtitle',
        icon: isLightMode ? Passwordless : PasswordlessDark,
        buttonText: 'admin_console.general.set_up',
        isComplete: settings?.passwordlessConfigured,
        onClick: () => {
          navigate('/connectors');
        },
      },
      {
        id: 'configureSocialSignIn',
        title: 'get_started.card5_title',
        subtitle: 'get_started.card5_subtitle',
        icon: isLightMode ? OneClick : OneClickDark,
        buttonText: 'admin_console.general.add',
        isComplete: settings?.socialSignInConfigured,
        onClick: () => {
          navigate('/connectors/social');
        },
      },
      {
        id: 'checkFurtherReadings',
        title: 'get_started.card6_title',
        subtitle: 'get_started.card6_subtitle',
        icon: isLightMode ? FurtherReadings : FurtherReadingsDark,
        buttonText: 'admin_console.general.check_out',
        isComplete: settings?.furtherReadingsChecked,
        onClick: () => {
          void updateSettings({ furtherReadingsChecked: true });
          window.open(
            `https://docs.logto.io/${conditionalString(
              language !== 'en' && language.toLowerCase()
            )}/docs/tutorials/get-started/further-readings`,
            '_blank'
          );
        },
      },
    ];

    return metadataItems.filter(({ isHidden }) => !isHidden);
  }, [
    hideDemo,
    isLightMode,
    language,
    navigate,
    settings?.applicationCreated,
    settings?.demoChecked,
    settings?.furtherReadingsChecked,
    settings?.passwordlessConfigured,
    settings?.signInExperienceCustomized,
    settings?.socialSignInConfigured,
    updateSettings,
  ]);

  return {
    data,
    completedCount: data.filter(({ isComplete }) => isComplete).length,
    totalCount: data.length,
    isLoading: isLoadingDemoApp,
  };
};

export default useGetStartedMetadata;
