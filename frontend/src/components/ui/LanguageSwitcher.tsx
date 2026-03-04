import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('en') ? 'am' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={i18n.language.startsWith('en') ? "Switch to Amharic" : "Switch to English"}
        >
            <Globe className="h-5 w-5" />
            <span className="text-sm font-medium uppercase">{i18n.language.startsWith('en') ? 'EN' : 'AM'}</span>
        </button>
    );
}
