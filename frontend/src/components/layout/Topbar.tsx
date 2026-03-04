import { Bell, Search, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export function Topbar() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="h-16 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 transition-colors duration-200">
            <div className="w-1/3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('topbar.searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                </button>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name || t('topbar.guest')}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || t('topbar.visitor')}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden bg-primary-100 text-primary-600 font-bold">
                        {user?.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <span>{user?.name ? getInitials(user.name) : "G"}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
