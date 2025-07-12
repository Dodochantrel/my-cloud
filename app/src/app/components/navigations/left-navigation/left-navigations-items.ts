import { NavigationItem } from "./left-navigation.component";

export const navigationItems: NavigationItem[] = [
    {
      name: 'Mon cinéma',
      icon: 'tv',
      path: null,
      isOpen: false,
      subNavigationItems: [
        { name: 'Films', icon: 'movie', path: '/videos/movies' },
        { name: 'Séries', icon: 'cast', path: '/videos/series' },
      ],
    },
    {
      name: 'Ma cuisine',
      icon: 'kitchen',
      path: null,
      isOpen: false,
      subNavigationItems: [
        { name: 'Entrées', icon: 'egg_alt', path: '/recipes/starters' },
        { name: 'Plats', icon: 'room_service', path: '/recipes/mains' },
        { name: 'Desserts', icon: 'cookie', path: '/recipes/desserts' },
        { name: 'Boissons', icon: 'sports_bar', path: '/recipes/drinks' },
        { name: 'Ajouter', icon: 'add_circle_outline', path: '/recipes/add' },
      ],
    },
    { name: 'Groupes', icon: 'groups', path: '/groups' },
    { name: 'Event', icon: 'event', path: '/events' },
    { name : 'Ma galerie', icon: 'add_photo_alternate', path: '/gallery' },
    {
      name: 'Mes dégustations',
      icon: 'liquor',
      path: '/tastings',
      isOpen: false,
    }
  ];

  export const adminNavigationItems: NavigationItem[] = [
    {
      name: 'Utilisateurs',
      icon: 'people',
      path: '/admin/users',
      isOpen: false,
    },
    {
      name: 'Catégories',
      icon: 'source',
      path: null,
      isOpen: false,
      subNavigationItems: [
        { name: 'Événements', icon: 'event', path: '/admin/categories/events' },
        { name: 'Dégustations', icon: 'sports_bar', path: '/admin/categories/tastings' },
      ],
    },
  ];