import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Kiswahili' },
];

const getCurrentLanguage = () => {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/googtrans=\/\w+\/(\w+)/);
  return match ? match[1] : 'en';
};

const detectBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language || 'en';
  const shortLang = lang.split('-')[0];
  return languageOptions.some((opt) => opt.code === shortLang)
    ? shortLang
    : 'en';
};

const LanguageSelector = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const initializeGoogleTranslate = () => {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr,sw',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
      setIsLoaded(true);
      removeTranslateBanner();
    }
  };

  const removeTranslateBanner = () => {
    const elements = document.querySelectorAll(
      '.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame'
    );
    elements.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
    document.body.style.top = '0px';
  };

  const loadGoogleTranslateScript = () => {
    const scriptId = 'google-translate-script';
    if (!document.querySelector(`#${scriptId}`)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const hasManualSelection = document.cookie.includes('manual_lang_set=true');

    if (!hasManualSelection) {
      const browserLang = detectBrowserLanguage();
      document.cookie = `googtrans=/auto/${browserLang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      document.cookie = `manual_lang_set=false; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      setSelectedLanguage(browserLang);
    } else {
      const currentLang = getCurrentLanguage();
      setSelectedLanguage(currentLang);
    }

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (!window.google?.translate?.TranslateElement) {
      loadGoogleTranslateScript();
    } else {
      initializeGoogleTranslate();
    }

    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, .goog-te-gadget {
        display: none !important;
      }
      body { top: 0px !important; }
      .skiptranslate iframe { display: none !important; }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(removeTranslateBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === selectedLanguage) {
      setIsOpen(false);
      return;
    }

    const cookieDomain = window.location.hostname;

    document.cookie = `googtrans=/auto/${langCode}; domain=${cookieDomain}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    document.cookie = `googtrans=/auto/${langCode}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    if (cookieDomain.indexOf('.') !== -1) {
      document.cookie = `googtrans=/auto/${langCode}; domain=.${cookieDomain}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    }

    document.cookie = `manual_lang_set=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    setSelectedLanguage(langCode);
    setIsOpen(false);

    const translateSelect = document.querySelector(
      '.goog-te-combo'
    ) as HTMLSelectElement;
    if (translateSelect) {
      translateSelect.value = langCode;
      translateSelect.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      window.location.reload();
    }
  };

  const currentLanguage = languageOptions.find(
    (lang) => lang.code === selectedLanguage
  );

  if (!isMounted) return null;

  return (
    <div className="relative z-50">
      {/* Mobile View */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-2 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-5 h-5 text-gray-700" />
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-24 bg-white rounded-md shadow-lg py-1 z-50">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                  selectedLanguage === lang.code
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="relative inline-block">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {currentLanguage?.name}
            </span>
            <svg
              className={`w-4 h-4 ml-1 text-gray-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-30 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                    selectedLanguage === lang.code
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
};

export default LanguageSelector;
