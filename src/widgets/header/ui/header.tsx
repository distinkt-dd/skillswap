import { useTheme } from '@app/theme/useTheme';
import { selectReceivedApplications, selectRejectedApplications } from '@entities/application';
import { selectedUser } from '@entities/user';
import { useCatalogFilters } from '@features/filters';
import { useSelector } from '@shared/store';
import { Avatar, Button, IconUI, Input, Logo } from '@shared/ui';
import { NotificationWrapper } from '@widgets/notifications/ui/Notification';
import { UserMenu } from '@widgets/user-menu';
import clsx from 'clsx';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CategoriesDropdown } from './categories';
import styles from './header.module.css';
import type { THeaderUIProps } from './type';

const SEARCH_DEBOUNCE_MS = 1200;
const SEARCH_HISTORY_STORAGE_KEY = 'catalog-search-history';
const SEARCH_HISTORY_LIMIT = 8;

const readSearchHistory = (): string[] => {
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0
    );
  } catch {
    return [];
  }
};

const saveSearchHistory = (history: string[]) => {
  try {
    window.localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    return;
  }
};

export const Header: FC<Partial<THeaderUIProps>> = ({
  isSkillsOpen = false,
  onSkillsToggle,
  categories = [],
  isLoading = false,
  error = null,
  onCategoryClick,
  onSubcategoryClick,
  variant = 'default',
  onClose,
}) => {
  const user = useSelector(selectedUser);
  const isAuth = !!user;
  const { themeMode, resolvedTheme, toggleTheme } = useTheme();
  const { filters: catalogFilters, actions: catalogFilterActions } = useCatalogFilters();
  const [searchInput, setSearchInput] = useState(catalogFilters.searchQuery);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => readSearchHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSearchDirty, setIsSearchDirty] = useState(false);
  const [isDropdownMounted, setIsDropdownMounted] = useState(isSkillsOpen);
  const [isDropdownVisible, setIsDropdownVisible] = useState(isSkillsOpen);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationTriggerRef = useRef<HTMLDivElement>(null);
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleMenuIsOpen = () => {
    setMenuIsOpen(!menuIsOpen);
    console.log(menuIsOpen);
  };

  const commitSearch = (value: string) => {
    catalogFilterActions.setSearchQuery(value);
    setIsSearchDirty(false);

    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    // new

    const next = [trimmed, ...searchHistory.filter((item) => item !== trimmed)].slice(
      0,
      SEARCH_HISTORY_LIMIT
    );
    saveSearchHistory(next);
    setSearchHistory(next);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setIsSearchDirty(true);
    setIsHistoryOpen(true);

    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => {
      commitSearch(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSearchBlur = () => {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    if (isSearchDirty) {
      commitSearch(searchInput);
    }

    window.setTimeout(() => setIsHistoryOpen(false), 100);
  };

  const handleSearchFocus = () => {
    if (searchHistory.length > 0) {
      setIsHistoryOpen(true);
    }
  };

  const handleHistorySelect = (value: string) => {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    setSearchInput(value);
    commitSearch(value);
    setIsHistoryOpen(false);
  };
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let closeTimer: number | undefined;
    let openRaf: number | undefined;
    let closeRaf: number | undefined;

    if (isSkillsOpen) {
      openRaf = window.requestAnimationFrame(() => {
        setIsDropdownMounted(true);
        setIsDropdownVisible(true);
      });
    } else if (isDropdownMounted) {
      closeRaf = window.requestAnimationFrame(() => {
        setIsDropdownVisible(false);
      });
      closeTimer = window.setTimeout(() => {
        setIsDropdownMounted(false);
      }, 220);
    }

    return () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
      }
      if (openRaf) {
        window.cancelAnimationFrame(openRaf);
      }
      if (closeRaf) {
        window.cancelAnimationFrame(closeRaf);
      }
    };
  }, [isSkillsOpen, isDropdownMounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onSkillsToggle?.();
      }
    };

    if (!isSkillsOpen) return;
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSkillsOpen, onSkillsToggle]);

  useEffect(() => {
    const handleClickOutsideNotification = (event: MouseEvent) => {
      if (
        notificationTriggerRef.current &&
        notificationTriggerRef.current.contains(event.target as Node)
      ) {
        return;
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (!isNotificationOpen) return;
    document.addEventListener('mousedown', handleClickOutsideNotification);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotification);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleClickOutsideAccountMenu = (event: MouseEvent) => {
      if (
        accountMenuTriggerRef.current &&
        accountMenuTriggerRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (!isAccountMenuOpen) return;
    document.addEventListener('mousedown', handleClickOutsideAccountMenu);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAccountMenu);
    };
  }, [isAccountMenuOpen]);

  useEffect(() => {
    const handleClickOutsideAccountMenu = (event: MouseEvent) => {
      if (
        accountMenuTriggerRef.current &&
        accountMenuTriggerRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (!isAccountMenuOpen) return;
    document.addEventListener('mousedown', handleClickOutsideAccountMenu);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAccountMenu);
    };
  }, [isAccountMenuOpen]);

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (!searchAreaRef.current?.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, []);

  const filteredHistory = searchHistory.filter((item) =>
    searchInput.trim()
      ? item.toLocaleLowerCase().includes(searchInput.trim().toLocaleLowerCase())
      : true
  );

  const applications = useSelector(selectReceivedApplications);
  const rejectedApplications = useSelector(selectRejectedApplications);

  const themeLabel =
    themeMode === 'system'
      ? `Тема: системная, сейчас ${resolvedTheme === 'dark' ? 'темная' : 'светлая'}`
      : `Тема: ${resolvedTheme === 'dark' ? 'темная' : 'светлая'}`;

  if (variant === 'pure') {
    return (
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.pureNav}>
            <NavLink to="/" className={styles.logo}>
              <Logo />
            </NavLink>
            <Button variant="tertiary" onClick={onClose} iconPosition="right" width={147}>
              Закрыть
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        {isNotificationOpen && (
          <div ref={notificationRef} className={styles.notificationWrapper}>
            <NotificationWrapper
              applications={applications}
              rejectedApplications={rejectedApplications}
            />
          </div>
        )}

        <nav className={styles.nav}>
          <div className={styles.leftSection}>
            <NavLink to="/" className={styles.logo}>
              <Logo />
            </NavLink>

            <div className={styles.navLinks}>
              <NavLink to="/about">О проекте</NavLink>

              <button
                ref={triggerRef}
                type="button"
                className={styles.navLinkWithDropdown}
                onClick={onSkillsToggle}
                aria-expanded={isSkillsOpen}
                aria-controls="skills-dropdown"
              >
                <span>Все навыки</span>
                <IconUI name="chevronDown" />
              </button>
            </div>

            {isDropdownMounted && (
              <div
                id="skills-dropdown"
                ref={dropdownRef}
                className={`${styles.dropdownWrapper} ${
                  isDropdownVisible ? styles.dropdownOpen : styles.dropdownClosing
                }`}
              >
                {isLoading && <div>Загрузка...</div>}
                {error && <div>{error}</div>}
                {!isLoading && !error && (
                  <CategoriesDropdown
                    categories={categories}
                    onCategoryClick={onCategoryClick}
                    onSubcategoryClick={onSubcategoryClick}
                  />
                )}
              </div>
            )}

            <div className={styles.searchArea} ref={searchAreaRef}>
              <Input
                leftIcon={<IconUI name="search" />}
                placeholder="Искать навык"
                className={styles.searchInput}
                variant="search"
                fullWidth
                value={isSearchDirty ? searchInput : catalogFilters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                aria-label="Поиск по категории или подкатегории навыка"
              />
              {isHistoryOpen && filteredHistory.length > 0 && (
                <div className={styles.searchHistoryDropdown}>
                  {filteredHistory.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={styles.searchHistoryItem}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleHistorySelect(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            className={styles.burger}
            variant="tertiary"
            width={44}
            children={<IconUI name="menu" size={44} />}
            onClick={() => handleMenuIsOpen()}
          />

          <div className={clsx(styles.rightSection, menuIsOpen ? styles.rightSectionOpen : '')}>
            <div className={`${styles.rightGroup} ${isAuth ? styles.auth : ''}`}>
              <button
                type="button"
                className={styles.themeButton}
                onClick={toggleTheme}
                aria-label={themeLabel}
                title={themeLabel}
              >
                <IconUI
                  name={resolvedTheme === 'dark' ? 'sun' : 'moon'}
                  className={styles.themeIcon}
                />
              </button>

              <div className={`${styles.buttonsGroup} ${isAuth ? styles.auth : ''}`}>
                {isAuth ? (
                  <>
                    <div
                      ref={notificationTriggerRef}
                      className={clsx(
                        styles.notificationIconWrapper,
                        (applications.length === 0 && rejectedApplications.length === 0) ||
                          styles.notificationIconWrapperActive
                      )}
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    >
                      <IconUI name="notification" className={styles.notificationIcon} />
                    </div>
                    <NavLink to="/favorites">
                      <IconUI name="like" className={styles.likeIcon} />
                    </NavLink>
                    <div
                      ref={accountMenuTriggerRef}
                      className={styles.userBlock}
                      onClick={() => {
                        setIsAccountMenuOpen(!isAccountMenuOpen);
                      }}
                    >
                      <span className={styles.userName}>{user?.name}</span>
                      <Avatar src={user?.avatar} size="small" />
                    </div>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={styles.buttonLink}>
                      <Button variant="secondary" width={98}>
                        Войти
                      </Button>
                    </NavLink>
                    <NavLink to="/registration" className={styles.buttonLink}>
                      <Button variant="primary" width={208}>
                        Зарегистрироваться
                      </Button>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        {isAuth && isAccountMenuOpen && <UserMenu refMenu={accountMenuRef} />}
      </div>
    </header>
  );
};
